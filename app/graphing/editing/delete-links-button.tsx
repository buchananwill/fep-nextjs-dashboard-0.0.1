import { GraphEditButton } from './graph-edit-button';
import { useGraphEditButtonHooks } from './use-graph-edit-button-hooks';
import React, { useMemo } from 'react';
import { deleteLinks } from './graph-edits';
import { HasNumberIdDto } from '../../api/dtos/HasNumberIdDtoSchema';
import { resetLinks } from './add-nodes-button';

const deleteLinksKey = 'delete-links';

export function DeleteLinksButton<T extends HasNumberIdDto>({
  children
}: {
  children: string;
}) {
  const deleteLinksMemoKey = useMemo(() => {
    return deleteLinksKey;
  }, []);
  const {
    nodeListRef,
    linkListRef,
    incrementSimVersion,
    deBounce,
    deBouncing,
    checkForSelectedNodes,
    noNodeSelected,
    selected,
    deletedLinkIds,
    setDeletedLinkIds
  } = useGraphEditButtonHooks<T>(deleteLinksMemoKey);

  if (linkListRef === null) return <></>;

  const handleDeleteLinks = () => {
    if (nodeListRef === undefined || nodeListRef === null) return;
    if (!checkForSelectedNodes(1)) return;
    const mode = selected.length === 1 ? 'any' : 'all';
    const { toDelete, remainingLinks } = deleteLinks(
      linkListRef.current,
      selected,
      mode
    );
    setDeletedLinkIds([...deletedLinkIds, ...toDelete]);
    deBounce();
    nodeListRef.current = [...nodeListRef.current];
    linkListRef.current = resetLinks(remainingLinks);
    incrementSimVersion();
  };
  return (
    <GraphEditButton
      noNodeSelected={noNodeSelected}
      onClick={handleDeleteLinks}
      disabled={deBouncing}
    >
      {children}
    </GraphEditButton>
  );
}
