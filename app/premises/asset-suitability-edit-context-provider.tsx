'use client';
import { RatingEditModal } from '../staffroom/contexts/providerRoles/rating-edit-modal';
import { AssetSuitabilityEditContext } from '../staffroom/contexts/providerRoles/rating-edit-context';
import { PropsWithChildren } from 'react';
import { useRatingEditModal } from '../staffroom/contexts/providerRoles/use-rating-edit-modal';
import {
  assetRoleWorkTaskSuitabilityLabelAccessor,
  assetRoleWorkTaskSuitabilityRatingAccessor
} from './classroom-suitability/rating-table-accessor-functions';
import { AssetDto } from '../api/dtos/AssetDtoSchema';

export default function AssetSuitabilityEditContextProvider({
  children
}: PropsWithChildren) {
  const confirmRatingValue = () => {};

  const { triggerModal, elementInModal, ratingEditModalProps } =
    useRatingEditModal({
      confirmRatingValue,
      ratingValueAccessor: assetRoleWorkTaskSuitabilityRatingAccessor,
      nameAccessor: (asset: AssetDto) => asset.name,
      ratingCategoryLabelAccessor: assetRoleWorkTaskSuitabilityLabelAccessor
    });

  return (
    <AssetSuitabilityEditContext.Provider value={{ triggerModal }}>
      {children}
      {<RatingEditModal {...ratingEditModalProps} />}
    </AssetSuitabilityEditContext.Provider>
  );
}
