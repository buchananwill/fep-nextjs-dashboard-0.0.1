'use client';
import React, { useMemo, useState } from 'react';
import {
  useGenericGraphRefs,
  useGenericNodeContext
} from '../nodes/generic-node-context-creator';
import { createNode, createNewLinks, TransientIdOffset } from './node-edits';
import { useSelectiveContextDispatchNumber } from '../../components/selective-context/selective-context-manager-number';
import { DataNode } from '../../api/zod-mods';
import {
  useSelectiveContextGraphDispatch,
  useSelectiveContextGraphNumberDispatch,
  useSelectiveGraphContextKey
} from '../graph/graph-context-creator';
import { useSelectiveContextDispatchNumberList } from '../../components/selective-context/selective-context-manager-number-list';
import { useNodeInteractionContext } from '../nodes/node-interaction-context';
import { useSelectiveContextDispatchBoolean } from '../../components/selective-context/selective-context-manager-boolean';

export type Relation = 'sibling' | 'child';

export function AddNode<T>({
  reference,
  children,
  relation
}: {
  reference: DataNode<T>;
  relation: Relation;
  children: string;
}) {
  const { uniqueGraphName } = useGenericNodeContext<T>();
  const { nodeListRef, linkListRef } = useGenericGraphRefs<T>();

  const { selected } = useNodeInteractionContext();

  const { contextVersionKey, listenerVersionKey } = useMemo(() => {
    const contextVersionKey = `${uniqueGraphName}-version`;
    const listenerVersionKey = `${uniqueGraphName}:${relation}:${reference.id}:add-node-button`;
    return { contextVersionKey, listenerVersionKey };
  }, [uniqueGraphName, relation, reference]);

  const buttonListenerKey = useMemo(() => {
    return `${reference.id}:${relation}`;
  }, [reference, relation]);

  const { contextKeyConcat, listenerKeyConcat } = useSelectiveGraphContextKey(
    'nextNodeId',
    buttonListenerKey
  );
  const { currentState: nextNodeId, dispatchUpdate: setNextNodeId } =
    useSelectiveContextDispatchNumber(contextKeyConcat, listenerKeyConcat, NaN);

  const { currentState: nextLinkId, simpleDispatch: setNextLinkId } =
    useSelectiveContextGraphNumberDispatch(
      'nextLinkId',
      buttonListenerKey,
      NaN
    );

  const { currentState: simVersion, dispatchUpdate } =
    useSelectiveContextDispatchNumber(contextVersionKey, listenerVersionKey, 0);

  const { nodesInit, linksInit } = useMemo(() => {
    const nodesInit = [] as number[];
    const linksInit = [] as number[];
    return { nodesInit, linksInit };
  }, []);

  const {
    simpleDispatch: setTransientNodeIds,
    currentState: transientNodeIds
  } = useSelectiveContextGraphDispatch(
    'transientNodeIds',
    buttonListenerKey,
    nodesInit,
    useSelectiveContextDispatchNumberList
  );

  const {
    simpleDispatch: setTransientLinkIds,
    currentState: transientLinkIds
  } = useSelectiveContextGraphDispatch(
    'transientLinkIds',
    buttonListenerKey,
    linksInit,
    useSelectiveContextDispatchNumberList
  );

  const [noNodeSelected, setNoNodeSelected] = useState(false);

  // const [transientNodeIds, setTransientNodeIds] = useState([] as number[]);
  // const [transientLinkIds, setTransientLinkIds] = useState([] as number[]);
  // const [nextNodeId, setNextNodeId] = useState<number | undefined>(undefined);
  // const [nextLinkId, setNextLinkId] = useState<number | undefined>(undefined);
  const [deBouncing, setDeBouncing] = useState<boolean>(false);

  if (nodeListRef === null || linkListRef === null) return <></>;

  const nodesListRefCurrent = nodeListRef.current;

  const nextIndex = nodesListRefCurrent.length;

  const getNextNodeId = () => {
    let responseId =
      // nextNodeId === undefined ? TransientIdOffset + 1 : nextNodeId;
      isNaN(nextNodeId) ? TransientIdOffset + 1 : nextNodeId;
    const nodeIdSet = new Set(transientNodeIds);
    while (nodeIdSet.has(responseId)) {
      responseId++;
    }
    setNextNodeId({ contextKey: contextKeyConcat, value: responseId + 1 });
    // setNextNodeId((prev) => responseId + 1);
    return responseId;
  };
  const getNextLinkId = () => {
    let responseId =
      // nextLinkId === undefined ? TransientIdOffset + 1 : nextLinkId;
      isNaN(nextLinkId) ? TransientIdOffset + 1 : nextLinkId;
    const linkIdSet = new Set(transientLinkIds);
    while (linkIdSet.has(responseId)) {
      responseId++;
    }
    setNextLinkId(responseId + 1);
    return responseId;
  };
  const handleAddNode = () => {
    if (selected.length == 0) {
      if (!noNodeSelected) {
        setNoNodeSelected(true);
        setTimeout(() => {
          if (setNoNodeSelected) setNoNodeSelected(false);
        }, 2000);
      }
      return;
    }

    const refNodes = nodeListRef.current.filter((n) => selected.includes(n.id));

    const nextNodeToSubmit = getNextNodeId();
    const { allNodes, createdNodes } = createNode({
      startIdAt: nextNodeToSubmit,
      targetNodes: refNodes,
      allNodes: nodeListRef.current,
      relation
    });

    setTransientNodeIds([
      ...transientNodeIds,
      ...createdNodes.map((n) => n.id)
    ]);

    const nextLinkIdToSubmit = getNextLinkId();

    const { allUpdatedLinks, newLinks } = createNewLinks<T>({
      references: refNodes,
      newNodes: createdNodes,
      allLinks: linkListRef.current,
      linkIdSequenceStart: nextLinkIdToSubmit,
      relation: relation
    });

    const newLinkIds = newLinks.map((l) => l.id);

    setTransientLinkIds([...transientLinkIds, ...newLinkIds]);

    setDeBouncing(true);
    setTimeout(() => setDeBouncing(false), 250);

    linkListRef.current = [...allUpdatedLinks].map((link, index) => {
      const source = link.source as DataNode<T>;
      const target = link.target as DataNode<T>;
      return { ...link, source: source.id, target: target.id, index };
    });
    nodeListRef.current = allNodes;

    dispatchUpdate({ contextKey: contextVersionKey, value: simVersion + 1 });
  };

  return (
    <button
      className={'btn btn-primary btn-outline'}
      onClick={handleAddNode}
      disabled={deBouncing}
    >
      {noNodeSelected && (
        <span
          className={
            'badge badge-error absolute -bottom-10 text-xs h-fit animate-pulse'
          }
        >
          No node selected!
        </span>
      )}
      {children}
    </button>
  );
}
