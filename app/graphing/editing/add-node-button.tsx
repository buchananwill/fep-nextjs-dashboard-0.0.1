'use client';
import React, { useContext, useState } from 'react';
import {
  GenericNodeRefContext,
  useGenericGraphRefs,
  useGenericNodeContext
} from '../nodes/generic-node-context-creator';
import { GenericLinkRefContext } from '../links/generic-link-context-creator';
import {
  createNode,
  createSiblingLinks,
  TransientIdOffset
} from './node-edits';
import { useSelectiveContextDispatchNumber } from '../../components/selective-context/selective-context-manager-number';
import { DataNode } from '../../api/zod-mods';
import next from 'next-auth/src';

export function AddNode<T>({ reference }: { reference: DataNode<T> }) {
  const {
    dispatch: dispatchNodes,
    nodes,
    uniqueGraphName
  } = useGenericNodeContext<T>();
  const { nodeListRef, linkListRef } = useGenericGraphRefs<T>();

  const contextAlterKey = `${uniqueGraphName}-version`;
  const listenerAlterKey = `${uniqueGraphName}-add-node-button`;

  const { currentState: simVersion, dispatchUpdate } =
    useSelectiveContextDispatchNumber(contextAlterKey, listenerAlterKey, 0);
  // const { dispatch: dispatchLinks, links } = useGenericLinkContext<T>();
  const [transientNodeIds, setTransientNodeIds] = useState([] as number[]);
  const [transientLinkIds, setTransientLinkIds] = useState([] as number[]);
  const [nextNodeId, setNextNodeId] = useState<number | undefined>(undefined);
  const [nextLinkId, setNextLinkId] = useState<number | undefined>(undefined);
  const [deBouncing, setDeBouncing] = useState<boolean>(false);

  if (nodeListRef === null || linkListRef === null) return <></>;

  const nodesListRefCurrent = nodeListRef.current;

  const nextIndex = nodesListRefCurrent.length;

  const getNextNodeId = () => {
    let responseId =
      nextNodeId === undefined ? TransientIdOffset + 1 : nextNodeId;
    const nodeIdSet = new Set(transientNodeIds);
    while (nodeIdSet.has(responseId)) {
      responseId++;
    }
    setNextNodeId(responseId + 1);
    return responseId;
  };
  const getNextLinkId = () => {
    let responseId =
      nextLinkId === undefined ? TransientIdOffset + 1 : nextLinkId;
    const linkIdSet = new Set(transientLinkIds);
    while (linkIdSet.has(responseId)) {
      responseId++;
    }
    setNextLinkId(responseId + 1);
    return responseId;
  };
  const handleAddNode = () => {
    // if (nodeListRef === null) return;
    const lastNode = reference;
    const { data, distanceFromRoot, x, y, id } = lastNode;
    const duplicateNodeData = { ...data };
    const nextNodeToSubmit = getNextNodeId();
    const { allNodes, createdNode } = createNode({
      data: duplicateNodeData,
      id: nextNodeToSubmit,
      distanceFromRoot,
      template: lastNode,
      nodes: nodeListRef.current
    });

    setTransientNodeIds((prev) => [...prev, createdNode.id]);

    const nextLinkIdToSubmit = getNextLinkId();

    const { allUpdatedLinks, linksAssignedToYoungerSibling } =
      createSiblingLinks<T>({
        elderSibling: lastNode,
        youngerSibling: createdNode,
        allLinks: linkListRef.current,
        linkIdSequenceStart: nextLinkIdToSubmit
      });

    const numbers = linksAssignedToYoungerSibling.map((l) => l.id);

    setTransientLinkIds((prev) => [...prev, ...numbers]);

    setDeBouncing(true);
    setTimeout(() => setDeBouncing(false), 250);

    const updatePendingLinks = [...allUpdatedLinks].map((link, index) => {
      const source = link.source as DataNode<T>;
      const target = link.target as DataNode<T>;
      return { ...link, source: source.id, target: target.id, index };
    });

    linkListRef.current = updatePendingLinks;
    nodeListRef.current = allNodes;

    dispatchUpdate({ contextKey: contextAlterKey, value: simVersion + 1 });
  };

  return (
    <button
      className={'btn btn-primary btn-outline'}
      onClick={handleAddNode}
      disabled={deBouncing}
    >
      Add Node
    </button>
  );
}
