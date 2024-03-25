'use client';
import { RatingEditModal } from '../staffroom/contexts/providerRoles/rating-edit-modal';
import { AssetSuitabilityEditContext } from '../staffroom/contexts/providerRoles/rating-edit-context';
import { PropsWithChildren } from 'react';
import { useRatingEditModal } from '../staffroom/contexts/providerRoles/use-rating-edit-modal';
import {
  assetNameAccessor,
  assetRoleWorkTaskSuitabilityDtoListAccessor,
  assetRoleWorkTaskSuitabilityIdAccessor,
  assetRoleWorkTaskSuitabilityLabelAccessor,
  assetRoleWorkTaskSuitabilityRatingValueAccessor,
  AssetSuitabilityAccessorFunctions,
  IdStringFromNumberAccessor
} from './classroom-suitability/rating-table-accessor-functions';
import { AssetDto } from '../api/dtos/AssetDtoSchema';
import {
  AssetStringMapDispatchContext,
  UnsavedAssetChanges,
  useAssetStringMapContext
} from './asset-string-map-context-creator';
import { AssetRoleWorkTaskSuitabilityDto } from '../api/dtos/AssetRoleWorkTaskSuitabilityDtoSchema';
import { produce } from 'immer';
import { useConfirmRatingValueFunction } from './use-confirm-rating-value-function';
import { useAssetSuitabilityListDispatch } from '../components/selective-context/typed/asset-suitability-list-selective-context-provider';

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
  const confirmRatingValue = useConfirmRatingValueFunction(
    useAssetSuitabilityListDispatch,
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

  console.log('rendering edit context');

  return (
    <AssetSuitabilityEditContext.Provider
      value={{
        triggerModal,
        useRatingListListenerHook: useAssetSuitabilityListDispatch,
        ...AssetSuitabilityAccessorFunctions
      }}
    >
      {children}
      <RatingEditModal {...ratingEditModalProps} />
    </AssetSuitabilityEditContext.Provider>
  );
}
