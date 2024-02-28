'use client';
import { DataLink, DataNode } from '../../api/zod-mods';
import { Relation } from './add-node-button';

export const TransientIdOffset = Math.pow(2, 50);

export interface InitNode<T> {
  data: T;
  id: number;
  distanceFromRoot: number;
  template: DataNode<T>;
  nodes: DataNode<T>[];
  relation: Relation;
}

export interface LinkParams<T> {
  reference: DataNode<T>;
  newNode: DataNode<T>;
  allLinks: DataLink<T>[];
  linkIdSequenceStart: number;
  relation: Relation;
}

export function createNode<T>(initNode: InitNode<T>): {
  allNodes: DataNode<T>[];
  createdNode: DataNode<T>;
} {
  const { template, id, distanceFromRoot, data, nodes, relation } = initNode;
  const newDistance =
    relation === 'sibling' ? distanceFromRoot : distanceFromRoot + 1;
  const createdNode = {
    ...template,
    id: id,
    data: data,
    distanceFromRoot: newDistance,
    index: nodes.length
  };

  const allNodes = [...nodes, createdNode];
  return { allNodes, createdNode };
}

export function createNewLinks<T>({
  reference,
  newNode,
  allLinks,
  linkIdSequenceStart,
  relation
}: LinkParams<T>): { allUpdatedLinks: DataLink<T>[]; newLinks: DataLink<T>[] } {
  switch (relation) {
    case 'sibling': {
      console.log('Making sibling');
      const linksAsChild = allLinks.filter(
        (l) => (l.source as DataNode<T>).id === reference.id
      );

      const linksAssignedToYoungerSibling = linksAsChild.map(
        (l, index) =>
          ({
            ...l,
            source: newNode,
            id: linkIdSequenceStart + index,
            index: index
          }) as DataLink<T>
      );
      console.log(linksAssignedToYoungerSibling);
      const allUpdatedLinks = [
        ...allLinks,
        ...linksAssignedToYoungerSibling
      ].map((l, index) => ({ ...l, index }));
      return { allUpdatedLinks, newLinks: linksAssignedToYoungerSibling };
    }
    case 'child': {
      console.log('making child');
      const templateLink = allLinks[0];
      const newLink = {
        ...templateLink,
        source: newNode,
        target: reference,
        index: 0,
        id: linkIdSequenceStart
      } as DataLink<T>;
      const singletonLink: DataLink<T>[] = [];
      singletonLink.push(newLink);
      const allUpdatedLinks = [...allLinks, ...singletonLink].map(
        (l, index) => ({
          ...l,
          index
        })
      );
      return { allUpdatedLinks, newLinks: singletonLink };
    }
  }
}
