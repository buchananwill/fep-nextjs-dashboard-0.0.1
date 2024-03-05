'use client';

import React, { ReactNode, useContext, useMemo, useState } from 'react';
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
import { NodeVersionKey } from './graph-types/curriculum-delivery-graph';

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
  const { dispatch: genericNodeDispatch } =
    useGenericNodeContext<DataNode<T>>();
  const { dispatch: genericLinkDispatch } =
    useGenericLinkContext<DataLink<T>>();

  const nodesRef = useContext(GenericNodeRefContext);
  const linksRef = useContext(GenericLinkRefContext);
  // const contextAlterKey = `${uniqueGraphName}-ready`;
  // const listenerAlterKey = `${uniqueGraphName}-force-sim-wrapper`;
  //

  const { currentState, dispatchWithoutControl } =
    useSelectiveContextDispatchNumber({
      contextKey: NodeVersionKey,
      listenerKey: 'wrapper',
      initialValue: 0
    });

  const [simDisplaying, setSimDisplaying] = useState(false);

  const ticked = useMemo(() => {
    return () => {
      // if (nodesRef) {
      //   genericNodeDispatch(nodesRef.current.map((d) => ({ ...d })));
      // }
      // if (linksRef)
      //   genericLinkDispatch(linksRef.current.map((d) => ({ ...d })));
      dispatchWithoutControl(currentState + 1);
      setSimDisplaying(true);
    };
  }, [
    currentState,
    dispatchWithoutControl
    // linksRef,
    // nodesRef,
    // genericNodeDispatch,
    // genericLinkDispatch
  ]);

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
