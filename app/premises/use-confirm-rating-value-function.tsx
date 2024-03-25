import {
  AccessorFunction,
  RatingCategoryIdAccessor,
  RatingListAccessor
} from '../staffroom/teachers/rating-table';
import { useSelectiveContextDispatchBoolean } from '../components/selective-context/selective-context-manager-boolean';
import { Dispatch, useCallback } from 'react';
import { useSelectiveContextDispatchStringList } from '../components/selective-context/selective-context-manager-string-list';
import { EmptyIdArray } from '../curriculum/delivery-models/contexts/curriculum-models-context-provider';
import { UpdateAction } from '../components/selective-context/selective-context-manager';
import { UseSelectiveContextDispatch } from '../components/selective-context/use-selective-context-listener';

const emptyArray: any[] = [];

export interface ConfirmRatingValue<R, E> {
  (rating: R, elementWithRatings: E, updatedValue: number): void;
}

export function useConfirmRatingValueFunction<R, E>(
  useSelectiveDispatchHook: UseSelectiveContextDispatch<R[]>,
  ratingListAccessor: RatingListAccessor<E, R>,
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

  const { dispatch } = useSelectiveDispatchHook('', '', emptyArray as R[]);

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
