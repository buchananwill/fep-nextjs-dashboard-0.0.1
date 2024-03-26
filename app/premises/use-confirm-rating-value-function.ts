import {
  AccessorFunction,
  RatingCategoryIdAccessor
} from '../generic/components/tables/rating/rating-table';
import { useSelectiveContextDispatchBoolean } from '../generic/components/selective-context/selective-context-manager-boolean';
import { useCallback } from 'react';
import { useSelectiveContextDispatchStringList } from '../generic/components/selective-context/selective-context-manager-string-list';
import { EmptyIdArray } from '../curriculum/delivery-models/contexts/curriculum-models-context-provider';
import { UseSelectiveContextDispatch } from '../generic/hooks/selective-context/use-selective-context-listener';
import { SelectiveContextReadAll } from '../generic/components/selective-context/generic-selective-context-creator';
import { EmptyArray, isNotUndefined } from '../api/main';

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
  const { dispatchWithoutControl } = useSelectiveContextDispatchBoolean(
    unsavedChangesContextKey,
    unsavedChangesListenerKey,
    false
  );

  const { currentState, dispatchWithoutControl: addIdToUnsavedList } =
    useSelectiveContextDispatchStringList({
      contextKey: unsavedChangesContextKey,
      listenerKey: unsavedChangesListenerKey,
      initialValue: EmptyIdArray
    });

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
      addIdToUnsavedList([...currentState, idForMap]);
      dispatchWithoutControl(true);
    },
    [
      dispatch,
      currentState,
      addIdToUnsavedList,
      ratingListAccessor,
      ratingCategoryIdAccessor,
      ratingValueSetter,
      ratingListSetter,
      elementStringIdAccessor,
      dispatchWithoutControl
    ]
  );
}
