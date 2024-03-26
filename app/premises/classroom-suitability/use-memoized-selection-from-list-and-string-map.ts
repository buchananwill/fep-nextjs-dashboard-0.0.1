import { StringMap } from '../../curriculum/delivery-models/contexts/string-map-context-creator';
import { useMemo } from 'react';
import { isNotNull } from '../../api/main';

export function useMemoizedSelectionFromListAndStringMap<T>(
  selectedList: number[],
  ratedElements: StringMap<T>
) {
  return useMemo(() => {
    return selectedList
      .map((id) => ratedElements[id.toString()])
      .filter(isNotNull<T>);
  }, [selectedList, ratedElements]);
}