'use client';
import { DataLink, DataNode } from '../../api/zod-mods';
import { CloneFunction, Relation } from './add-nodes-button';
import { HasNumberIdDto } from '../../api/dtos/HasNumberIdDtoSchema';

export function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}

export const TransientIdOffset = Math.pow(2, 50);

export interface CreateNodeParams<T extends HasNumberIdDto> {
  startIdAt: number;
  targetNodes: DataNode<T>[];
  allNodes: DataNode<T>[];
  relation: Relation;
  cloneFunction: CloneFunction<DataNode<T>>;
}

export interface LinkParams<T extends HasNumberIdDto> {
  references: DataNode<T>[];
  newNodes: DataNode<T>[];
  allLinks: DataLink<T>[];
  linkIdSequenceStart: number;
  relation: Relation;
}

export function createNode<T extends HasNumberIdDto>(
  createNodeParams: CreateNodeParams<T>
): {
  allNodes: DataNode<T>[];
  createdNodes: DataNode<T>[];
} {
  const {
    targetNodes,
    startIdAt,
    allNodes: oldNodes,
    relation,
    cloneFunction
  } = createNodeParams;
  let createdNodes: DataNode<T>[] = [];
  let counter = 0;
  for (const node of targetNodes) {
    const { distanceFromRoot, data, ...otherFields } = cloneFunction(node);
    const nextId = startIdAt + counter;
    data.id = nextId;
    const newDistance =
      relation === 'sibling' ? distanceFromRoot : distanceFromRoot + 1;
    const createdNode = {
      ...otherFields,
      id: nextId,
      distanceFromRoot: newDistance,
      data: data
    };
    createdNodes.push(createdNode);
    counter++;
  }

  const allNodes = [...oldNodes, ...createdNodes];
  return { allNodes, createdNodes };
}

export function createNewLinks<T extends HasNumberIdDto>({
  references,
  newNodes,
  allLinks,
  linkIdSequenceStart,
  relation
}: LinkParams<T>): { allUpdatedLinks: DataLink<T>[]; newLinks: DataLink<T>[] } {
  const newLinks: DataLink<T>[] = [];
  switch (relation) {
    case 'sibling': {
      console.log('Making sibling');
      for (let i = 0; i < newNodes.length; i++) {
        const referenceNode = references[i];
        const newNode = newNodes[i];
        const linksAsChild = allLinks.filter(
          (l) => (l.source as DataNode<T>).id === referenceNode.id
        );
        linksAsChild
          .map(
            (l, index) =>
              ({
                ...l,
                source: newNode,
                id: linkIdSequenceStart + i,
                index: index
              }) as DataLink<T>
          )
          .forEach((l) => newLinks.push(l));
      }
      break;
    }
    case 'child': {
      console.log('making child');
      const templateLink = allLinks[0];
      for (let i = 0; i < references.length; i++) {
        const targetNode = references[i];
        const sourceNode = newNodes[i];
        const newLink = {
          ...templateLink,
          source: sourceNode,
          target: targetNode,
          index: 0,
          id: linkIdSequenceStart + i
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

export function deleteLinks<T extends HasNumberIdDto>(
  linksListRef: DataLink<T>[],
  selectedNodeIds: number[]
) {
  const set = new Set(selectedNodeIds);
  const allPredicate = (l: DataLink<T>) => {
    return (
      set.has((l.target as DataNode<T>).id) &&
      set.has((l.source as DataNode<T>).id)
    );
  };

  const anyPredicate = (l: DataLink<T>) => {
    return (
      set.has((l.target as DataNode<T>).id) ||
      set.has((l.source as DataNode<T>).id)
    );
  };
  const deletionPredicate =
    selectedNodeIds.length === 1 ? anyPredicate : allPredicate;
  const toDelete: number[] = [];
  const remainingLinks = linksListRef
    .map((l) => {
      const deleteThisLink = deletionPredicate(l);
      if (deleteThisLink) {
        toDelete.push(l.id);
        return null;
      } else {
        return l;
      }
    })
    .filter(isNotNull);
  return { toDelete, remainingLinks };
}
