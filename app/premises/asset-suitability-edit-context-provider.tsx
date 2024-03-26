'use client';
import { RatingEditModal } from '../staffroom/contexts/providerRoles/rating-edit-modal';
import { AssetSuitabilityEditContext } from '../staffroom/contexts/providerRoles/rating-edit-context';
import { PropsWithChildren, ReactNode, useCallback } from 'react';
import {
  assetRoleWorkTaskSuitabilityIdAccessor,
  AssetSuitabilityAccessorFunctions,
  IdStringFromNumberAccessor
} from './classroom-suitability/rating-table-accessor-functions';
import { AssetDto } from '../api/dtos/AssetDtoSchema';
import { UnsavedAssetChanges } from './asset-string-map-context-creator';
import { AssetRoleWorkTaskSuitabilityDto } from '../api/dtos/AssetRoleWorkTaskSuitabilityDtoSchema';
import { produce } from 'immer';
import { useConfirmRatingValueFunction } from './use-confirm-rating-value-function';
import { useAssetSuitabilityListDispatch } from '../components/selective-context/typed/asset-suitability-list-selective-context-provider';

import { getCurriedProducer } from '../staffroom/contexts/providerRoles/get-curried-producer';
import { useSelectiveContextListenerReadAll } from '../components/selective-context/generic/generic-selective-context-creator';
import { AssetSuitabilityListSelectiveContext } from '../components/selective-context/typed/selective-context-creators';

const suitabilityProducer = getCurriedProducer<
  AssetRoleWorkTaskSuitabilityDto,
  number
>((rating, value) => (rating.suitabilityRating = value));
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
  const selectiveContextReadAll = useSelectiveContextListenerReadAll(
    AssetSuitabilityListSelectiveContext
  );

  const confirmRatingValue = useConfirmRatingValueFunction(
    useAssetSuitabilityListDispatch,
    selectiveContextReadAll,
    assetRoleWorkTaskSuitabilityIdAccessor,
    suitabilityProducer,
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
        useRatingListDispatchHook: useAssetSuitabilityListDispatch,
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
