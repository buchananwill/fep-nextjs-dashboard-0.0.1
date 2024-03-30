import {
  AccessorFunction,
  RatingCategoryIdAccessor
} from '../../../generic/components/tables/rating/rating-table';
import { useCallback } from 'react';
import { SelectiveContextReadAll } from '../../components/base/generic-selective-context-creator';
import { EmptyArray, isNotUndefined } from '../../../api/main';
import { useUnsavedListContext } from './use-unsaved-list-context';
import { UseSelectiveContextDispatch } from '../generic/use-selective-context-dispatch';

export interface ConfirmRatingValue<R, E> {
  (rating: R, elementWithRatings: E, updatedValue: number): void;
}

export function useConfirmRatingValueFunction<R, E>(
  useSelectiveDispatchHook: UseSelectiveContextDispatch<R[]>,
  ratingListAccessor: SelectiveContextReadAll<R[]>,
  ratingCategoryIdAccessor: RatingCategoryIdAccessor<R>,
  ratingValueSetter: (rating: R, value: number) => R,
  elementStringIdAccessor: AccessorFunction<E, string>,
  unsavedChangesContextKey: string,
  unsavedChangesListenerKey: string
): ConfirmRatingValue<R, E> {
  const addUnsavedChange = useUnsavedListContext(
    unsavedChangesContextKey,
    unsavedChangesListenerKey
  );

  const { dispatch } = useSelectiveDispatchHook('', '', EmptyArray as R[]);

  return useCallback(
    (rating: R, elementWithRatings: E, updatedValue: number) => {
      const ratingList = ratingListAccessor(
        elementStringIdAccessor(elementWithRatings)
      );
      if (!isNotUndefined(ratingList)) return;
      const updatedList = ratingList.map((ratingDto) =>
        ratingCategoryIdAccessor(ratingDto) === ratingCategoryIdAccessor(rating)
          ? ratingValueSetter(ratingDto, updatedValue)
          : ratingDto
      );

      const idForMap = elementStringIdAccessor(elementWithRatings);
      dispatch({
        contextKey: idForMap,
        value: updatedList
      });
      addUnsavedChange(idForMap);
    },
    [
      addUnsavedChange,
      dispatch,
      ratingListAccessor,
      ratingCategoryIdAccessor,
      ratingValueSetter,

      elementStringIdAccessor
    ]
  );
}
