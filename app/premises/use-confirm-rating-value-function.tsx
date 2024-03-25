import { StringMapDispatch } from '../curriculum/delivery-models/contexts/string-map-context-creator';
import {
  AccessorFunction,
  RatingCategoryIdAccessor,
  RatingListAccessor
} from '../staffroom/teachers/rating-table';
import { useSelectiveContextDispatchBoolean } from '../components/selective-context/selective-context-manager-boolean';
import { useCallback } from 'react';
import { useSelectiveContextDispatchStringList } from '../components/selective-context/selective-context-manager-string-list';
import { EmptyIdArray } from '../curriculum/delivery-models/contexts/curriculum-models-context-provider';

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

  const { currentState, dispatchWithoutControl: addIdToUnsavedList } =
    useSelectiveContextDispatchStringList({
      contextKey: unsavedChangesContextKey,
      listenerKey: unsavedChangesListenerKey,
      initialValue: EmptyIdArray
    });

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
        type: 'update',
        payload: {
          key: idForMap,
          data: updatedElement
        }
      });
      addIdToUnsavedList([...currentState, idForMap]);
      dispatchWithoutControl(true);
    },
    [
      currentState,
      addIdToUnsavedList,
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
