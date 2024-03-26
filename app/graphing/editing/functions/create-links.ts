import { HasNumberIdDto } from '../../../api/dtos/HasNumberIdDtoSchema';
import { DataLink, DataNode } from '../../../api/zod-mods';
import { Relation } from '../buttons/add-nodes-button';

export interface LinkParams<T extends HasNumberIdDto> {
  references: DataNode<T>[];
  newNodes: DataNode<T>[];
  allLinks: DataLink<T>[];
  linkIdSequenceStart: number;
  relation: Relation;
  templateLink?: DataLink<T>;
}

export function createLinks<T extends HasNumberIdDto>({
  references,
  newNodes,
  allLinks,
  linkIdSequenceStart,
  relation,
  templateLink
}: LinkParams<T>): {
  allUpdatedLinks: DataLink<T>[];
  newLinks: DataLink<T>[];
} {
  const newLinks: DataLink<T>[] = [];
  let nextLinkId = linkIdSequenceStart;
  switch (relation) {
    case 'sibling': {
      for (let i = 0; i < newNodes.length; i++) {
        const referenceNode = references[i];
        const newNode = newNodes[i];
        const linksAsChild = allLinks.filter(
          (l) => (l.source as DataNode<T>).id === referenceNode.id
        );
        linksAsChild
          .map((l, index) => {
            nextLinkId++;
            return {
              ...l,
              source: newNode,
              id: nextLinkId,
              index: index
            } as DataLink<T>;
          })
          .forEach((l) => newLinks.push(l));
      }
      break;
    }
    case 'child': {
      const templateLinkDefined =
        allLinks.length > 0
          ? allLinks[0]
          : templateLink !== undefined
          ? templateLink
          : null;
      if (templateLinkDefined === null)
        throw Error('No template link provided.');
      for (let i = 0; i < references.length; i++) {
        const targetNode = references[i];
        const sourceNode = newNodes[i];
        const currentLinkId = nextLinkId;
        nextLinkId++;
        const newLink = {
          ...templateLinkDefined,
          source: sourceNode,
          target: targetNode,
          index: 0,
          id: currentLinkId
        } as DataLink<T>;
        newLinks.push(newLink);
        console.log(newLink);
      }
      break;
    }
  }
  const allUpdatedLinks = [...allLinks, ...newLinks].map((l, index) => ({
    ...l,
    index
  }));
  return { allUpdatedLinks, newLinks };
}
