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
  getManyBodyStrengthFunction,
  updateManyBodyForce
} from './forces/force-many-body';
import {
  getLinkForceMinCosFallOffBusiestNode,
  updateLinkForce
} from './forces/force-link';
import { getForceCenter } from './forces/force-center';
import { getForceCollide } from './forces/force-collide';
import { useSelectiveContextListenerBoolean } from '../components/selective-context/selective-context-manager-boolean';
import { negativeLogTen } from './forces/math-functions';
import { updateForceRadial } from './forces/force-radial';
import { useSelectiveContextListenerNumber } from '../components/selective-context/selective-context-manager-number';
import { useSelectionContextGraphListener } from './graph/graph-context-creator';
import { useSelectiveContextDispatchNumberList } from '../components/selective-context/selective-context-manager-number-list';

export function useD3ForceSimulation<T>(
  nodesRef: MutableRefObject<DataNode<T>[]>,
  linksRef: MutableRefObject<DataLink<T>[]>,
  ticked: () => void,
  uniqueGraphName: string
) {
  // const width = 1800; //inputs?.width || 720;
  // const height = 1200; //inputs?.height || 720;

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
        .strength(centerStrength);

      const forceCollide = getForceCollide(20, collideStrength);

      const forceRadial = d3
        .forceRadial(width / 3, width / 2, height / 2)
        .strength((nextNode, i, allNodes) => {
          // const assetNode = nextNode as DataNode<T>;
          // return (
          //   forceRadialStrength *
          //   ((assetNode.distanceFromRoot + 1) / (maxDepth + 3))
          // );
          return 0.1;
        });

      const predicate = (nodeComparison: DataNode<T>) => {
        return (link: SimulationLinkDatum<DataNode<T>>) => {
          const source = link.source as DataNode<T>;
          const target = link.target as DataNode<T>;

          return (
            nodeComparison.id == source.id || nodeComparison.id == target.id
          );
        };
      };

      const maxDepth = nodesMutable
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
      if (forceLink) {
        simulation.force('link', forceLink);
      } else {
        simulation.force(
          'link',
          d3
            .forceLink(linksMutable)
            .id((d) => {
              const linkD = d as DataNode<T>;
              return linkD.id;
            })
            .distance(linkDistance)
        );
      }

      if (forceManyBody) {
        simulation.force('charge', forceManyBody);
      } else {
        simulation.force(
          'charge',
          d3
            .forceManyBody()
            .strength(getManyBodyStrengthFunction(nodesMutable, maxDepth))
            .distanceMin(1)
            .distanceMax(400)
        );
      }
      if (forceCollide) {
        simulation.force('collide', forceCollide);
      } else {
        simulation.force(
          'collide',
          d3
            .forceCollide((d) => {
              const assetNode = d as DataNode<AssetDto>;
              return Math.max(4 - assetNode.distanceFromRoot, 1) * 2 + 12;
            })
            .strength(0.5)
        );
      }

      if (forceCenter) {
        simulation.force('center', forceCenter);
      }

      // if (forceRadial) {
      //   simulation.force('radial', forceRadial);
      // }
      if (forceX) simulation.force('forceX', forceX);
      if (forceY) simulation.force('forceY', forceY);
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
      currentSim.force(
        'center',
        d3.forceCenter(width / 2, height / 2).strength(0.5)
      );
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
