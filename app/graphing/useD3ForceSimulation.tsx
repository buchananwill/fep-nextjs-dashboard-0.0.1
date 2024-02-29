import {
  AssetDto,
  DataLink,
  DataNode,
  ProductComponentNode
} from '../api/zod-mods';
import { MutableRefObject, useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { Simulation, SimulationLinkDatum, SimulationNodeDatum } from 'd3';

import { useForceAttributeListeners } from '../api/dtos/ForceGraphAttributesDtoSchema';
import { getGridX, updateForceX } from './forces/force-x';
import { getModulusGridY, updateForceY } from './forces/force-y';
import {
  getForceManyBody,
  updateManyBodyForce
} from './forces/force-many-body';
import {
  getLinkForceMinCosFallOffBusiestNode,
  updateLinkForce
} from './forces/force-link';
import { getForceCollide } from './forces/force-collide';
import { useSelectiveContextListenerBoolean } from '../components/selective-context/selective-context-manager-boolean';
import { negativeLogTen } from './forces/math-functions';
import { updateForceRadial } from './forces/force-radial';
import { useSelectiveContextListenerNumber } from '../components/selective-context/selective-context-manager-number';
import { useSelectionContextGraphListener } from './graph/graph-context-creator';
import { useSelectiveContextDispatchNumberList } from '../components/selective-context/selective-context-manager-number-list';

export type StandardForceKey =
  | 'link'
  | 'charge'
  | 'collide'
  | 'center'
  | 'radial'
  | 'forceX'
  | 'forceY';

export function useD3ForceSimulation<T>(
  nodesRef: MutableRefObject<DataNode<T>[]>,
  linksRef: MutableRefObject<DataLink<T>[]>,
  ticked: () => void,
  uniqueGraphName: string
) {
  const forceAttributeListeners = useForceAttributeListeners(uniqueGraphName);
  const {
    contextKey,
    listenerKey,
    contextAlterKey,
    listenerAlterKey,
    mountedListenerKey,
    mountedKey
  } = useMemo(() => {
    const contextAlterKey = `${uniqueGraphName}-version`;
    const listenerAlterKey = `${uniqueGraphName}-force-sim`;
    return {
      contextKey: `${uniqueGraphName}-ready`,
      listenerKey: `${uniqueGraphName}-force-sim`,
      listenerAlterKey,
      contextAlterKey,
      mountedKey: `${uniqueGraphName}-mounted`,
      mountedListenerKey: `${uniqueGraphName}-mounted-force-sim`
    };
  }, [uniqueGraphName]);

  const { isTrue: isReady } = useSelectiveContextListenerBoolean(
    contextKey,
    listenerKey,
    false
  );

  const { currentState: simVersion } = useSelectiveContextListenerNumber(
    contextAlterKey,
    listenerAlterKey,
    0
  );

  const { isTrue: isMounted } = useSelectiveContextListenerBoolean(
    mountedKey,
    mountedListenerKey,
    true
  );

  const dimensionArray = useMemo(() => {
    return [1800, 1200];
  }, []);

  const {
    currentState: [width, height]
  } = useSelectionContextGraphListener(
    'dimensions',
    listenerKey,
    dimensionArray,
    useSelectiveContextDispatchNumberList
  );

  const simVersionRef = useRef(simVersion);

  const simulationRef: MutableRefObject<Simulation<
    DataNode<T>,
    DataLink<T>
  > | null> = useRef(null);

  useEffect(() => {
    const numberOfNodes = nodesRef.current?.length || 0;
    const spacingX = numberOfNodes > 0 ? (width - 200) / numberOfNodes : 1;
    const spacingY = numberOfNodes > 0 ? (height / numberOfNodes) * 2 : 1;

    const nodesMutable = nodesRef.current;
    const linksMutable = linksRef.current;

    const {
      forceYStrength,
      forceXStrength,
      forceRadialStrength,
      forceRadialXRelative,
      forceRadialYRelative,
      manyBodyStrength,
      centerStrength,
      collideStrength,
      linkStrength,
      manyBodyMinDistance,
      manyBodyMaxDistance,
      manyBodyTheta,
      linkDistance
    } = forceAttributeListeners;

    function beginSim() {
      const forceX = getGridX(width, spacingX, negativeLogTen(forceXStrength));

      const forceY = getModulusGridY(
        spacingY,
        height,
        () => forceYStrength / 100
      );

      const forceManyBody = getForceManyBody(
        manyBodyMaxDistance,
        manyBodyMinDistance,
        () => manyBodyStrength / 100
      );

      const forceLink = getLinkForceMinCosFallOffBusiestNode(
        linksRef.current,
        () => {
          return nodesRef.current.length;
        },
        linkStrength
      );

      const forceCenter = d3
        .forceCenter(width / 2, height / 2)
        .strength(centerStrength / 200);

      const forceCollide = getForceCollide(20, collideStrength);

      const forceRadial = d3
        .forceRadial(width / 3, width / 2, height / 2)
        .strength((nextNode, i, allNodes) => {
          return forceRadialStrength;
        });
      nodesMutable
        .map((asset) => asset.distanceFromRoot)
        .reduce((prev, curr) => Math.max(prev, curr), 0.1);
      const linkDistance = (
        link: SimulationLinkDatum<DataNode<T>>,
        index: number,
        data: SimulationNodeDatum[]
      ) => {
        const dLink = link as DataLink<T>;
        const child = link.source as DataNode<T>;
        const distanceFromRoot = child.distanceFromRoot + 2.8;
        return 100 / Math.log(distanceFromRoot) / dLink.weighting;
      };

      const simulation = d3.forceSimulation<DataNode<T>, DataLink<T>>(
        nodesMutable
      );

      simulation.force('link', forceLink);
      simulation.force('charge', forceManyBody);
      simulation.force('collide', forceCollide);
      simulation.force('center', forceCenter);
      simulation.force('radial', forceRadial);
      simulation.force('forceX', forceX);
      simulation.force('forceY', forceY);
      simulation.on('tick', ticked);

      simulation.alphaDecay(0.0);
      simulation.alphaTarget(0);
      simulationRef.current = simulation;
    }

    function updateValues(currentSim: Simulation<DataNode<T>, DataLink<T>>) {
      updateLinkForce(currentSim, linkStrength, linkDistance);
      updateManyBodyForce(
        currentSim,
        manyBodyStrength,
        manyBodyTheta,
        manyBodyMinDistance,
        manyBodyMaxDistance
      );
      updateForceX(currentSim, forceXStrength);
      updateForceY(currentSim, forceYStrength);
      updateForceRadial(currentSim, forceRadialStrength);
    }

    if (!simulationRef.current) {
      if (isReady) {
        simVersionRef.current = simVersion;
        beginSim();
      }
    } else if (simulationRef.current) {
      if (simVersionRef.current !== simVersion) {
        simulationRef.current?.nodes(nodesMutable);
        const force = simulationRef.current?.force('link');
        if (force) {
          const forceLink = force as d3.ForceLink<DataNode<T>, DataLink<T>>;
          forceLink.links(linksMutable);
        }
      }
      simulationRef.current.on('tick', ticked);
      updateValues(simulationRef.current!);
    }
    return () => {
      if (!isMounted && simulationRef.current) simulationRef.current?.stop();
    };
  }, [
    isMounted,
    simVersion,
    forceAttributeListeners,
    nodesRef,
    linksRef,
    width,
    height,
    ticked,
    isReady
  ]);
}
