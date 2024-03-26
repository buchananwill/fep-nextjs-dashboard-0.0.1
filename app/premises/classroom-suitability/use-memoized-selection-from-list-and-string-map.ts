import { StringMap } from '../../contexts/string-map-context/string-map-reducer';
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
