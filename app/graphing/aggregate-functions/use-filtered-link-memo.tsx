import { ClosureDto } from '../../api/dtos/ClosureDtoSchema';
import { useMemo } from 'react';
import { Predicate } from '../../generic/components/filters/filter-types';

export function useFilteredLinkMemo(
  closureList: ClosureDto[],
  closurePredicate: Predicate<ClosureDto> = (c: ClosureDto) => c.value == 1
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
