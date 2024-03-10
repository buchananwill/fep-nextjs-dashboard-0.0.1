'use client';

import React, { ReactNode, useContext, useMemo, useRef, useState } from 'react';
import { DataLink, DataNode } from '../api/zod-mods';
import { useD3ForceSimulation } from './useD3ForceSimulation';
import {
  GenericLinkRefContext,
  useGenericLinkContext
} from './links/generic-link-context-creator';
import {
  GenericNodeRefContext,
  useGenericNodeContext
} from './nodes/generic-node-context-creator';
import { HasNumberIdDto } from '../api/dtos/HasNumberIdDtoSchema';
import {
  useSelectiveContextDispatchNumber,
  useSelectiveContextListenerNumber
} from '../components/selective-context/selective-context-manager-number';
import { NodePositionsKey } from './graph-types/organization/curriculum-delivery-graph';

export default function ForceSimWrapper<T extends HasNumberIdDto>({
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
      // console.log('Since last render:', elapsed);
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
