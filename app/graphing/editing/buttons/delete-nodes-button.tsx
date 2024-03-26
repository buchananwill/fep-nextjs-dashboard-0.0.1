import { useGraphEditButtonHooks } from '../functions/use-graph-edit-button-hooks';
import { useMemo } from 'react';
import { GraphEditButton } from './graph-edit-button';
import { DataNode } from '../../../api/zod-mods';
import { deleteLinks } from '../functions/graph-edits';
import { HasNumberIdDto } from '../../../api/dtos/HasNumberIdDtoSchema';
import { isNotNull } from '../../../api/main';

const deleteNodesKey = 'delete-nodes';

export function deleteNodes<T extends HasNumberIdDto>(
  selected: number[],
  current: DataNode<T>[]
) {
  const selectedNodeIdSet = new Set(selected);
  const nodesForDeletion: number[] = [];
  const remainingNodes = current
    .map((n) => {
      if (selectedNodeIdSet.has(n.id)) {
        nodesForDeletion.push(n.id);
        return null;
      } else {
        return n;
      }
    })
    .filter(isNotNull);
  return { nodesForDeletion, remainingNodes };
}

export function DeleteNodesButton<T extends HasNumberIdDto>({
  children
}: {
  children: string;
}) {
  const deleteNodesMemoKey = useMemo(() => {
    return deleteNodesKey;
  }, []);
  const {
    deBouncing,
    incrementSimVersion,
    deBounce,
    deletedNodeIds,
    deletedLinkIds,
    setDeletedLinkIds,
    linkListRef,
    selected,
    checkForSelectedNodes,
    noNodeSelected,
    nodeListRef,
    setDeletedNodeIds
  } = useGraphEditButtonHooks<T>(deleteNodesMemoKey);

  if (nodeListRef?.current == null || linkListRef?.current == null)
    return <></>;

  const handleDeleteNodes = () => {
    if (!checkForSelectedNodes(1)) return;
    const { remainingNodes, nodesForDeletion } = deleteNodes(
      selected,
      nodeListRef.current
    );
    let linksToDelete: number[] = [];
    let linkCache = [...linkListRef.current];
    for (let number of nodesForDeletion) {
      const { remainingLinks, toDelete } = deleteLinks<T>(
        linkCache,
        [number],
        'any'
      );
      linksToDelete = [...linksToDelete, ...toDelete];
      linkCache = remainingLinks;
    }
    setDeletedNodeIds([...deletedNodeIds, ...nodesForDeletion]);
    setDeletedLinkIds([...deletedLinkIds, ...linksToDelete]);
    deBounce();
    // linkListRef.current = resetLinks(linkCache);
    linkListRef.current = [...linkCache];
    nodeListRef.current = remainingNodes;
    incrementSimVersion();
  };

  return (
    <GraphEditButton
      noNodeSelected={noNodeSelected}
      disabled={deBouncing}
      onClick={handleDeleteNodes}
    >
      {children}
    </GraphEditButton>
  );
}
