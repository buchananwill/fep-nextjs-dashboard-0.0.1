'use client';
import { DataLink, DataNode } from '../../../api/zod-mods';
import { HasNumberIdDto } from '../../../api/dtos/HasNumberIdDtoSchema';
import { isNotNull } from '../../../api/main';

export const TransientIdOffset = Math.pow(2, 50);

export function deleteLinks<T extends HasNumberIdDto>(
  linksListRef: DataLink<T>[],
  selectedNodeIds: number[],
  mode: 'any' | 'all'
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
  const deletionPredicate = mode === 'any' ? anyPredicate : allPredicate;
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
