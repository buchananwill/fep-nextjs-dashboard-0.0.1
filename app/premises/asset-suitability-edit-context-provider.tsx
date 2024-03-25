'use client';
import { RatingEditModal } from '../staffroom/contexts/providerRoles/rating-edit-modal';
import { AssetSuitabilityEditContext } from '../staffroom/contexts/providerRoles/rating-edit-context';
import { PropsWithChildren, ReactNode } from 'react';
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
import {
  ConfirmRatingValue,
  useConfirmRatingValueFunction
} from './use-confirm-rating-value-function';
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

interface RatingEditModalWrapperProps<R, E> {
  confirmRatingValue: ConfirmRatingValue<R, E>;
}

function RatingEditModalWrapper<R, E>(
  props: { children: ReactNode } & RatingEditModalWrapperProps<R, E>
) {
  return;
}

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

  console.log('rendering edit context');

  return (
    <AssetSuitabilityEditContext.Provider
      value={{
        confirmRatingValue: confirmRatingValue,
        useRatingListListenerHook: useAssetSuitabilityListDispatch,
        ...AssetSuitabilityAccessorFunctions
      }}
    >
      <RatingEditModal
        confirmRatingValue={confirmRatingValue}
        ratingValueAccessor={
          AssetSuitabilityAccessorFunctions.ratingValueAccessor
        }
        ratingCategoryLabelAccessor={
          AssetSuitabilityAccessorFunctions.ratingCategoryLabelAccessor
        }
        nameAccessor={AssetSuitabilityAccessorFunctions.elementLabelAccessor}
      >
        {children}
      </RatingEditModal>
    </AssetSuitabilityEditContext.Provider>
  );
}
