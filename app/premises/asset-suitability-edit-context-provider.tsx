'use client';
import { RatingEditModal } from '../generic/components/modals/rating-edit-modal';
import { GenericRatingEditContext } from '../generic/components/tables/rating/rating-edit-context';
import { PropsWithChildren } from 'react';
import {
  assetRoleWorkTaskSuitabilityIdAccessor,
  AssetSuitabilityAccessorFunctions,
  IdStringFromNumberAccessor
} from './classroom-suitability/rating-table-accessor-functions';
import { UnsavedAssetChanges } from './asset-string-map-context-creator';
import { AssetRoleWorkTaskSuitabilityDto } from '../api/dtos/AssetRoleWorkTaskSuitabilityDtoSchema';
import { useConfirmRatingValueFunction } from '../selective-context/hooks/derived/use-confirm-rating-value-function';
import { useAssetSuitabilityListDispatch } from '../contexts/selective-context/asset-suitability-list-selective-context-provider';

import { getCurriedProducer } from '../staffroom/contexts/providerRoles/get-curried-producer';
import { useSelectiveContextListenerReadAll } from '../selective-context/components/base/generic-selective-context-creator';
import { AssetSuitabilityListSelectiveContext } from '../contexts/selective-context/selective-context-creators';

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
    IdStringFromNumberAccessor,
    UnsavedAssetChanges,
    UnsavedAssetChangesListenerKey
  );

  return (
    <GenericRatingEditContext.Provider
      value={{
        confirmRatingValue: confirmRatingValue,
        ratingProducer: suitabilityProducer,
        useRatingListDispatchHook: useAssetSuitabilityListDispatch,
        unsavedChangesKey: UnsavedAssetChanges,
        unsavedChangesListKey: UnsavedAssetChanges,
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
        ratingDescriptor={'Classroom Suitability'}
      >
        {children}
      </RatingEditModal>
    </GenericRatingEditContext.Provider>
  );
}

export const UnsavedAssetChangesListenerKey = 'asset-suitability-edit-context';

const suitabilityProducer = getCurriedProducer<
  AssetRoleWorkTaskSuitabilityDto,
  number
>((rating, value) => (rating.suitabilityRating = value));
