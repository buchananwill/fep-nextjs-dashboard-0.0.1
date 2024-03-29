'use client';

import React, { ReactNode, useContext, useRef, useState } from 'react';
import { useD3ForceSimulation } from './useD3ForceSimulation';
import { GenericLinkRefContext } from './links/generic-link-context-creator';
import { GenericNodeRefContext } from './nodes/generic-node-context-creator';
import { useSelectiveContextDispatchNumber } from '../selective-context/components/typed/selective-context-manager-number';
import { NodePositionsKey } from './graph-types/organization/curriculum-delivery-graph';

export default function ForceSimWrapper({
  linkElements,
  nodeElements,
  textElements,
  uniqueGraphName
}: {
  textElements: ReactNode[];
  nodeElements: ReactNode[];
  linkElements: ReactNode[];
  uniqueGraphName: string;
}) {
  const nodesRef = useContext(GenericNodeRefContext);
  const linksRef = useContext(GenericLinkRefContext);

  const { currentState, dispatchWithoutControl } =
    useSelectiveContextDispatchNumber({
      contextKey: NodePositionsKey,
      listenerKey: 'wrapper',
      initialValue: 0
    });

  const lastRenderTimer = useRef(Date.now());

  const [simDisplaying, setSimDisplaying] = useState(false);

  const ticked = () => {
    const elapsed = Date.now() - lastRenderTimer.current;
    if (elapsed >= 25) {
      lastRenderTimer.current = Date.now();
      dispatchWithoutControl(currentState + 1);
    }
    if (!simDisplaying) setSimDisplaying(true);
  };

  useD3ForceSimulation(nodesRef!, linksRef!, ticked, uniqueGraphName);

  return (
    <g>
      {simDisplaying && (
        <>
          <g>{...linkElements}</g>
          <g>{...nodeElements}</g>
          <g>{...textElements}</g>
        </>
      )}
    </g>
  );
}
