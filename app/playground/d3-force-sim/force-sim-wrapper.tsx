'use client';

import React, {
  CSSProperties,
  ReactNode,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react';
import { DataLink, DataNode } from '../../api/zod-mods';
import { useD3ForceSimulation } from './useD3ForceSimulation';
import NodeInteractionProvider from '../nodes/node-interaction-context';
import {
  GenericLinkRefContext,
  useGenericLinkContext
} from '../links/generic-link-context-creator';
import {
  GenericNodeRefContext,
  useGenericNodeContext
} from '../nodes/generic-node-context-creator';

import { ForceSimSettings } from '../components/graph-force-adjustment';

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

  const [simDisplaying, setSimDisplaying] = useState(false);

  const ticked = useMemo(() => {
    return () => {
      if (nodesRef)
        genericNodeDispatch(nodesRef.current.map((d) => ({ ...d })));

      if (linksRef)
        genericLinkDispatch(linksRef.current.map((d) => ({ ...d })));
      if (!simDisplaying) setSimDisplaying(true);
      console.log('Ticking!');
    };
  }, [
    linksRef,
    nodesRef,
    genericNodeDispatch,
    genericLinkDispatch,
    simDisplaying
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
