import {
  AccessorFunction,
  RatingCategoryIdAccessor
} from '../../components/tables/rating/rating-table';
import { useCallback } from 'react';
import { UseSelectiveContextDispatch } from './use-selective-context-listener';
import { SelectiveContextReadAll } from '../../components/selective-context/generic-selective-context-creator';
import { EmptyArray, isNotUndefined } from '../../../api/main';
import { useUnsavedListContext } from './use-unsaved-list-context';

export interface ConfirmRatingValue<R, E> {
  (rating: R, elementWithRatings: E, updatedValue: number): void;
}

export function useConfirmRatingValueFunction<R, E>(
  useSelectiveDispatchHook: UseSelectiveContextDispatch<R[]>,
  ratingListAccessor: SelectiveContextReadAll<R[]>,
  ratingCategoryIdAccessor: RatingCategoryIdAccessor<R>,
  ratingValueSetter: (rating: R, value: number) => R,
  ratingListSetter: (elementWithRatings: E, list: R[]) => E,
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
      const updatedElement = ratingListSetter(elementWithRatings, updatedList);
      const idForMap = elementStringIdAccessor(updatedElement);
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
      ratingListSetter,
      elementStringIdAccessor
    ]
  );
}
