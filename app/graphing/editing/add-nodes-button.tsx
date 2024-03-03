import React, { useMemo } from 'react';
import { createNewLinks, createNode } from './graph-edits';
import { DataNode } from '../../api/zod-mods';
import { useGraphEditButtonHooks } from './use-graph-edit-button-hooks';
import { GraphEditButton } from './graph-edit-button';

export type Relation = 'sibling' | 'child';

const addNodesButton = `add-nodes-button`;

export interface CloneFunction<T> {
  (object: T): T;
}

export function AddNodesButton<T>({
  children,
  relation,
  cloneFunction
}: {
  relation: Relation;
  children: string;
  cloneFunction: CloneFunction<DataNode<T>>;
}) {
  const buttonListenerKey = useMemo(() => {
    return `${addNodesButton}:${relation}`;
  }, [relation]);
  const {
    nodeListRef,
    linkListRef,
    selected,
    incrementSimVersion,
    setTransientNodeIds,
    transientNodeIds,
    setTransientLinkIds,
    transientLinkIds,
    checkForSelectedNodes,
    noNodeSelected,
    deBouncing,
    deBounce,
    getNextLinkId,
    getNextNodeId
  } = useGraphEditButtonHooks<T>(buttonListenerKey);

  if (nodeListRef === null || linkListRef === null) return <></>;

  const handleAddNode = () => {
    if (!checkForSelectedNodes()) return;

    const refNodes = nodeListRef.current.filter((n) => selected.includes(n.id));

    const nextNodeToSubmit = getNextNodeId();
    const { allNodes, createdNodes } = createNode({
      startIdAt: nextNodeToSubmit,
      targetNodes: refNodes,
      allNodes: nodeListRef.current,
      relation,
      cloneFunction
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

    deBounce();
    console.log('Before updating the links:', linkListRef);

    linkListRef.current = [...allUpdatedLinks].map((link, index) => {
      const source = link.source as DataNode<T>;
      const target = link.target as DataNode<T>;
      return { ...link, source: source.id, target: target.id, index };
    });
    nodeListRef.current = allNodes;
    console.log('After updating the links:', linkListRef);

    incrementSimVersion();
  };

  return (
    <GraphEditButton
      onClick={handleAddNode}
      disabled={deBouncing}
      noNodeSelected={noNodeSelected}
    >
      {children}
    </GraphEditButton>
  );
}
