'use client';
import { RatingEditModal } from '../staffroom/contexts/providerRoles/rating-edit-modal';
import { AssetSuitabilityEditContext } from '../staffroom/contexts/providerRoles/rating-edit-context';
import { PropsWithChildren, useCallback, useContext } from 'react';
import { useRatingEditModal } from '../staffroom/contexts/providerRoles/use-rating-edit-modal';
import {
  assetNameAccessor,
  assetRoleWorkTaskSuitabilityDtoListAccessor,
  assetRoleWorkTaskSuitabilityIdAccessor,
  assetRoleWorkTaskSuitabilityLabelAccessor,
  assetRoleWorkTaskSuitabilityRatingValueAccessor,
  AssetSuitabilityAccessorFunctions,
  IdAccessor,
  IdStringFromNumberAccessor
} from './classroom-suitability/rating-table-accessor-functions';
import { AssetDto } from '../api/dtos/AssetDtoSchema';
import {
  UnsavedAssetChanges,
  useAssetStringMapContext
} from './asset-string-map-context-creator';
import { AssetRoleWorkTaskSuitabilityDto } from '../api/dtos/AssetRoleWorkTaskSuitabilityDtoSchema';
import { produce } from 'immer';
import { StringMapDispatch } from '../curriculum/delivery-models/contexts/string-map-context-creator';
import {
  AccessorFunction,
  RatingCategoryIdAccessor,
  RatingListAccessor,
  RatingValueAccessor
} from '../staffroom/teachers/rating-table';
import {
  isNotNull,
  isNotUndefined
} from '../graphing/editing/functions/graph-edits';
import { useSelectiveContextDispatchBoolean } from '../components/selective-context/selective-context-manager-boolean';

function useConfirmRatingValueFunction<R, E>(
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

const suitabilityRatingSetter = (
  assetSuitability: AssetRoleWorkTaskSuitabilityDto,
  updatedValue: number
) => {
  return produce(assetSuitability, (draft) => {
    draft.suitabilityRating = updatedValue;
  });
};
const suitabilityListSetter = (
  assetDto: AssetDto,
  list: AssetRoleWorkTaskSuitabilityDto[]
) => {
  return produce(assetDto, (draft) => {
    draft.assetRoleWorkTaskSuitabilities = list;
  });
};

export default function AssetSuitabilityEditContextProvider({
  children
}: PropsWithChildren) {
  const { assetDtoStringMapDispatch } = useAssetStringMapContext();

  const confirmRatingValue = useConfirmRatingValueFunction(
    assetDtoStringMapDispatch,
    assetRoleWorkTaskSuitabilityDtoListAccessor,
    assetRoleWorkTaskSuitabilityIdAccessor,
    suitabilityRatingSetter,
    suitabilityListSetter,
    IdStringFromNumberAccessor,
    UnsavedAssetChanges,
    'asset-suitability-edit-context'
  );

  const { triggerModal, ratingEditModalProps } = useRatingEditModal({
    confirmRatingValue,
    ratingValueAccessor: assetRoleWorkTaskSuitabilityRatingValueAccessor,
    nameAccessor: assetNameAccessor,
    ratingCategoryLabelAccessor: assetRoleWorkTaskSuitabilityLabelAccessor
  });

  return (
    <AssetSuitabilityEditContext.Provider
      value={{ triggerModal, ...AssetSuitabilityAccessorFunctions }}
    >
      {children}
      {<RatingEditModal {...ratingEditModalProps} />}
    </AssetSuitabilityEditContext.Provider>
  );
}
