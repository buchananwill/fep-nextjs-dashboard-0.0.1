'use client';
import { DataLink, DataNode } from '../../api/zod-mods';

export const TransientIdOffset = Math.pow(2, 50);

export interface InitNode<T> {
  data: T;
  id: number;
  distanceFromRoot: number;
  template: DataNode<T>;
  nodes: DataNode<T>[];
}

export interface SiblingParams<T> {
  elderSibling: DataNode<T>;
  youngerSibling: DataNode<T>;
  allLinks: DataLink<T>[];
  linkIdSequenceStart: number;
}

export function createNode<T>(initNode: InitNode<T>): {
  allNodes: DataNode<T>[];
  createdNode: DataNode<T>;
} {
  const { template, id, distanceFromRoot, data, nodes } = initNode;
  const createdNode = {
    ...template,
    id: id + TransientIdOffset,
    data: data,
    distanceFromRoot: distanceFromRoot,
    index: nodes.length
  };

  const allNodes = [...nodes, createdNode];
  return { allNodes, createdNode };
}

export function createSiblingLinks<T>({
  elderSibling,
  youngerSibling,
  allLinks,
  linkIdSequenceStart
}: SiblingParams<T>) {
  const linksAsChild = allLinks.filter(
    (l) => (l.source as DataNode<T>).id === elderSibling.id
  );

  const linksAssignedToYoungerSibling = linksAsChild.map(
    (l, index) =>
      ({
        ...l,
        source: youngerSibling,
        id: linkIdSequenceStart + index,
        index: index
      }) as DataLink<T>
  );
  console.log(linksAssignedToYoungerSibling);
  const allUpdatedLinks = [...allLinks, ...linksAssignedToYoungerSibling].map(
    (l, index) => ({ ...l, index })
  );
  return { allUpdatedLinks, linksAssignedToYoungerSibling };
}
