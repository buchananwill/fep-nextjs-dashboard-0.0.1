import { StringMapDispatch } from '../curriculum/delivery-models/contexts/string-map-context-creator';
import {
  AccessorFunction,
  RatingCategoryIdAccessor,
  RatingListAccessor
} from '../staffroom/teachers/rating-table';
import { useSelectiveContextDispatchBoolean } from '../components/selective-context/selective-context-manager-boolean';
import { useCallback } from 'react';

export function useConfirmRatingValueFunction<R, E>(
  dispatch: StringMapDispatch<E>,
  ratingListAccessor: RatingListAccessor<E, R>,
  ratingCategoryIdAccessor: RatingCategoryIdAccessor<R>,
  ratingValueSetter: (rating: R, value: number) => R,
  ratingListSetter: (elementWithRatings: E, list: R[]) => E,
  elementStringIdAccessor: AccessorFunction<E, string>,
  unsavedChangesContextKey: string,
  unsavedChangesListenerKey: string
) {
  const { dispatchWithoutControl } = useSelectiveContextDispatchBoolean(
    unsavedChangesContextKey,
    unsavedChangesListenerKey,
    false
  );

  return useCallback(
    (rating: R, elementWithRatings: E, updatedValue: number) => {
      const updatedList = ratingListAccessor(elementWithRatings).map(
        (ratingDto) =>
          ratingCategoryIdAccessor(ratingDto) ===
          ratingCategoryIdAccessor(rating)
            ? ratingValueSetter(ratingDto, updatedValue)
            : ratingDto
      );
      const updatedElement = ratingListSetter(elementWithRatings, updatedList);
      dispatch({
        type: 'update',
        payload: {
          key: elementStringIdAccessor(updatedElement),
          data: updatedElement
        }
      });
      dispatchWithoutControl(true);
    },
    [
      dispatch,
      ratingListAccessor,
      ratingCategoryIdAccessor,
      ratingValueSetter,
      ratingListSetter,
      elementStringIdAccessor,
      dispatchWithoutControl
    ]
  );
}