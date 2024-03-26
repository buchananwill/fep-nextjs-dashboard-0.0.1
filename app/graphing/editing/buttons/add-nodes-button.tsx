import React, { useMemo } from 'react';
import { DataNode } from '../../../api/zod-mods';
import { useGraphEditButtonHooks } from '../functions/use-graph-edit-button-hooks';
import { GraphEditButton } from './graph-edit-button';
import { HasNumberIdDto } from '../../../api/dtos/HasNumberIdDtoSchema';
import { createNodes } from '../functions/create-nodes';
import { createLinks } from '../functions/create-links';
import { CloneFunction } from './clone-function';

export type Relation = 'sibling' | 'child';

const addNodesButton = `add-nodes-button`;

export function AddNodesButton<T extends HasNumberIdDto>({
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
    const { allNodes, createdNodes } = createNodes({
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

    const { allUpdatedLinks, newLinks } = createLinks<T>({
      references: refNodes,
      newNodes: createdNodes,
      allLinks: linkListRef.current,
      linkIdSequenceStart: nextLinkIdToSubmit,
      relation: relation
    });

    const newLinkIds = newLinks.map((l) => l.id);

    setTransientLinkIds([...transientLinkIds, ...newLinkIds]);

    deBounce();

    // linkListRef.current = resetLinks(allUpdatedLinks);
    linkListRef.current = [...allUpdatedLinks];
    nodeListRef.current = allNodes;

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
