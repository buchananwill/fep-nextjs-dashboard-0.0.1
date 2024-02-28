import { DataLink, DataNode, GraphDto } from '../../api/zod-mods';
import { Predicate } from '../../components/filters/filter-types';
import { ClosureDto } from '../../api/dtos/ClosureDtoSchema';
import { useMemo } from 'react';

export function useFilteredLinkMemo<T>(
  closureList: ClosureDto[],
  closurePredicate: Predicate<ClosureDto> = (c) => c.value == 1
) {
  const filteredLinks = useMemo(
    () =>
      closureList.filter(closurePredicate).map((d) => ({
        ...d
      })),
    [closurePredicate, closureList]
  );

  return { filteredLinks };
}
