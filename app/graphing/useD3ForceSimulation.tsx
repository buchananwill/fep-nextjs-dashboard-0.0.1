import { DataLink, DataNode } from '../api/zod-mods';
import { MutableRefObject, useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { Simulation } from 'd3';

import { useForceAttributeListeners } from '../api/dtos/ForceGraphAttributesDtoSchema';
import {
  getHorizontalParentsToChildrenLayout,
  updateForceX
} from './forces/force-x';
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
import { useSelectiveContextListenerBoolean } from '../selective-context/components/typed/selective-context-manager-boolean';
import { getForceRadial, updateForceRadial } from './forces/force-radial';
import { useSelectiveContextListenerNumber } from '../selective-context/components/typed/selective-context-manager-number';
import { useGraphSelectiveContextListener } from './graph/graph-context-creator';
import { useSelectiveContextListenerNumberList } from '../selective-context/components/typed/selective-context-manager-number-list';
import { HasNumberIdDto } from '../api/dtos/HasNumberIdDtoSchema';

export type StandardForceKey =
  | 'link'
  | 'charge'
  | 'collide'
  | 'center'
  | 'radial'
  | 'forceX'
  | 'forceY';

export function useD3ForceSimulation<T extends HasNumberIdDto>(
  nodesRef: MutableRefObject<DataNode<T>[]>,
  linksRef: MutableRefObject<DataLink<T>[]>,
  ticked: () => void,
  uniqueGraphName: string
) {
  const forceAttributeListeners = useForceAttributeListeners(uniqueGraphName);
  const { contextKey, listenerKey, mountedListenerKey, mountedKey } =
    useMemo(() => {
      return {
        contextKey: `${uniqueGraphName}-ready`,
        listenerKey: `${uniqueGraphName}-force-sim`,
        mountedKey: `${uniqueGraphName}-mounted`,
        mountedListenerKey: `${uniqueGraphName}-mounted-force-sim`
      };
    }, [uniqueGraphName]);

  const { isTrue: isReady } = useSelectiveContextListenerBoolean(
    contextKey,
    listenerKey,
    false
  );

  const { currentState: simVersion } = useGraphSelectiveContextListener(
    'version',
    listenerKey,
    0,
    useSelectiveContextListenerNumber
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
  } = useGraphSelectiveContextListener(
    'dimensions',
    listenerKey,
    dimensionArray,
    useSelectiveContextListenerNumberList
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
      forceYStrengthNormalized,
      forceXStrengthNormalized,
      forceRadialStrengthNormalized,
      manyBodyStrengthNormalized,
      centerStrengthNormalized,
      collideStrengthNormalized,
      linkStrengthNormalized,
      manyBodyMinDistanceNormalized,
      manyBodyMaxDistanceNormalized,
      manyBodyThetaNormalized,
      linkDistanceNormalized,
      forceRadialStrengthRef,
      centerStrengthRef,
      collideStrengthRef,
      forceRadialXRelativeNormalized,
      forceRadialXRelativeRef,
      forceRadialYRelativeNormalized,
      forceRadialYRelativeRef,
      forceXStrengthRef,
      forceYStrengthRef,
      linkDistanceRef,
      linkStrengthRef,
      manyBodyMaxDistanceRef,
      manyBodyMinDistanceRef,
      manyBodyStrengthRef,
      manyBodyThetaRef
    } = forceAttributeListeners;

    function beginSim() {
      // const forceX = getGridX(width, spacingX, forceXStrengthNormalized);
      const forceX = getHorizontalParentsToChildrenLayout(
        nodesMutable,
        width,
        forceXStrengthNormalized
      );
      const forceY = getModulusGridY(
        spacingY,
        height,
        () => forceYStrengthNormalized
      );

      const forceManyBody = getForceManyBody(
        manyBodyMaxDistanceNormalized,
        manyBodyMinDistanceNormalized,
        () => manyBodyStrengthNormalized
      );

      const forceLink = getLinkForceMinCosFallOffBusiestNode(
        linksRef.current,
        () => {
          return nodesRef.current.length;
        },
        linkStrengthNormalized,
        linkDistanceNormalized
      );

      const forceCenter = d3
        .forceCenter(width / 2, height / 2)
        .strength(centerStrengthNormalized);

      const forceCollide = getForceCollide(20, collideStrengthNormalized);

      const forceRadial = getForceRadial(
        width,
        height,
        forceRadialStrengthNormalized
      );

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
      if (
        linkStrengthRef.current != linkStrengthNormalized ||
        linkDistanceRef.current != linkDistanceNormalized
      ) {
        updateLinkForce(
          currentSim,
          linkStrengthNormalized,
          linkDistanceNormalized
        );
        linkStrengthRef.current = linkStrengthNormalized;
        linkDistanceRef.current = linkDistanceNormalized;
      }
      if (
        manyBodyThetaRef.current != manyBodyThetaNormalized ||
        manyBodyStrengthRef.current != manyBodyStrengthNormalized ||
        manyBodyMinDistanceRef.current != manyBodyMinDistanceNormalized ||
        manyBodyMaxDistanceRef.current != manyBodyMaxDistanceNormalized
      ) {
        updateManyBodyForce(
          currentSim,
          manyBodyStrengthNormalized,
          manyBodyThetaNormalized,
          manyBodyMinDistanceNormalized,
          manyBodyMaxDistanceNormalized
        );
        manyBodyThetaRef.current = manyBodyThetaNormalized;
        manyBodyStrengthRef.current = manyBodyStrengthNormalized;
        manyBodyMinDistanceRef.current = manyBodyMinDistanceNormalized;
        manyBodyMaxDistanceRef.current = manyBodyMaxDistanceNormalized;
      }
      if (forceXStrengthRef.current != forceXStrengthNormalized) {
        updateForceX(currentSim, forceXStrengthNormalized);
        forceXStrengthRef.current = forceXStrengthNormalized;
      }
      if (forceYStrengthRef.current != forceYStrengthNormalized) {
        updateForceY(currentSim, forceYStrengthNormalized);
        forceYStrengthRef.current = forceYStrengthNormalized;
      }
      if (forceRadialStrengthRef.current != forceRadialStrengthNormalized) {
        updateForceRadial(currentSim, forceRadialStrengthNormalized);
        forceRadialStrengthRef.current = forceRadialStrengthNormalized;
      }
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
