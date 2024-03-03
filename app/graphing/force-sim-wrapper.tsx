'use client';

import React, {
  CSSProperties,
  ReactNode,
  useContext,
  useMemo,
  useState
} from 'react';
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
import { useSelectiveContextListenerNumber } from '../components/selective-context/selective-context-manager-number';

export default function ForceSimWrapper<T>({
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
  const { dispatch: genericNodeDispatch, nodes } =
    useGenericNodeContext<DataNode<T>>();
  const { dispatch: genericLinkDispatch, links } =
    useGenericLinkContext<DataLink<T>>();

  const nodesRef = useContext(GenericNodeRefContext);
  const linksRef = useContext(GenericLinkRefContext);
  // const contextAlterKey = `${uniqueGraphName}-ready`;
  // const listenerAlterKey = `${uniqueGraphName}-force-sim-wrapper`;
  //

  const [simDisplaying, setSimDisplaying] = useState(false);

  const ticked = useMemo(() => {
    return () => {
      if (nodesRef) {
        genericNodeDispatch(nodesRef.current.map((d) => ({ ...d })));
      }
      if (linksRef)
        genericLinkDispatch(linksRef.current.map((d) => ({ ...d })));
      setSimDisplaying(true);
    };
  }, [linksRef, nodesRef, genericNodeDispatch, genericLinkDispatch]);

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
