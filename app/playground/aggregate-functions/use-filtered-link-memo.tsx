import { DataLink, DataNode, GraphDto } from '../../api/zod-mods';
import { Predicate } from '../../components/filters/filter-types';
import { ClosureDto } from '../../api/dtos/ClosureDtoSchema';
import { useMemo } from 'react';

export function useFilteredLinkMemo<T>(
  graphDto: GraphDto<T>,
  closurePredicate: Predicate<ClosureDto> = (c) => c.value == 1
) {
  const filteredLinks = useMemo(
    () =>
      graphDto.closureDtos.filter(closurePredicate).map((d) => ({
        ...d
      })),
    [closurePredicate, graphDto]
  );

  return { filteredLinks };
}
