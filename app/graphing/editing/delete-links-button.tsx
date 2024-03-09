import { GraphEditButton } from './graph-edit-button';
import { useGraphEditButtonHooks } from './use-graph-edit-button-hooks';
import React, { useMemo } from 'react';
import { deleteLinks } from './graph-edits';
import { HasNumberIdDto } from '../../api/dtos/HasNumberIdDtoSchema';

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
    if (!checkForSelectedNodes(1)) return;
    const { toDelete, remainingLinks } = deleteLinks(
      linkListRef.current,
      selected
    );
    setDeletedLinkIds([...deletedLinkIds, ...toDelete]);
    deBounce();
    linkListRef.current = remainingLinks;
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
