import { useGraphEditButtonHooks } from '../functions/use-graph-edit-button-hooks';
import React, { useMemo } from 'react';
import { GraphEditButton } from './graph-edit-button';
import { channel } from 'node:diagnostics_channel';
import { deleteLinks } from '../functions/graph-edits';
import { DataLink, DataNode } from '../../../api/zod-mods';
import { HasNumberIdDto } from '../../../api/dtos/HasNumberIdDtoSchema';
import { resetLinks } from './add-nodes-button';
import { createLinks } from '../functions/create-links';
const InvertLinksKey = 'invert-links';

export default function InvertLinksButton<T extends HasNumberIdDto>({
  children
}: {
  children: string;
}) {
  const {
    selected,
    linkListRef,
    nodeListRef,
    getNextLinkId,
    setTransientLinkIds,
    setDeletedLinkIds,
    deletedLinkIds,
    transientLinkIds,
    noNodeSelected,
    checkForSelectedNodes,
    deBounce,
    deBouncing,
    incrementSimVersion
  } = useGraphEditButtonHooks<T>(InvertLinksKey);

  if (nodeListRef === null || linkListRef === null) return <></>;

  // Only operates on links where both nodes are selected.
  const handleInvertLinks = () => {
    if (!checkForSelectedNodes(2)) return;
    const nodesFilteredForSelection = nodeListRef.current.filter((n) =>
      selected.includes(n.id)
    );
    if (linkListRef.current.length == 0) return;

    const linksToKeep: DataLink<T>[] = [];
    const linksToInvert: DataLink<T>[] = [];

    linkListRef.current.forEach((l) => {
      if (
        selected.includes((l.source as DataNode<T>).id) &&
        selected.includes((l.target as DataNode<T>).id)
      ) {
        linksToInvert.push(l);
      } else {
        linksToKeep.push(l);
      }
    });

    let nextLinkId = getNextLinkId();

    const childToParent: DataNode<T>[] = [];
    const parentToChild: DataNode<T>[] = [];
    for (let link of linksToInvert) {
      const child = link.source as DataNode<T>;
      const parent = link.target as DataNode<T>;
      childToParent.push(child);
      parentToChild.push(parent);
    }

    const linksToDelete = linksToInvert.map((l) => l.id);

    const { newLinks, allUpdatedLinks } = createLinks({
      references: childToParent,
      newNodes: parentToChild,
      allLinks: linksToKeep,
      linkIdSequenceStart: nextLinkId,
      relation: 'child',
      templateLink: linkListRef.current[0]
    });

    const newLinkIds = newLinks.map((l) => l.id);
    setDeletedLinkIds([...deletedLinkIds, ...linksToDelete]);
    setTransientLinkIds([...transientLinkIds, ...newLinkIds]);
    nodeListRef.current = [...nodeListRef.current];
    linkListRef.current = resetLinks([...allUpdatedLinks]);
    incrementSimVersion();

    deBounce();
  };

  return (
    <GraphEditButton
      noNodeSelected={noNodeSelected}
      onClick={handleInvertLinks}
      disabled={deBouncing}
    >
      {children}
    </GraphEditButton>
  );
}
