import {
  SelectiveContext,
  useSelectiveContextListenerReadAll
} from '../../selective-context/components/base/generic-selective-context-creator';
import { AccessorFunction } from '../../generic/components/tables/rating/rating-table';
import { useCallback } from 'react';

export function useSelectiveContextRatingListAccessor<R, E>(
  context: SelectiveContext<R[]>,
  keyAccessor: AccessorFunction<E, string>
) {
  const selectiveContextReadAll = useSelectiveContextListenerReadAll(context);

  return useCallback(
    (elementWithRatings: E) =>
      selectiveContextReadAll(keyAccessor(elementWithRatings)),
    [selectiveContextReadAll, keyAccessor]
  );
}
