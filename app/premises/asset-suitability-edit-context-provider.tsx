'use client';
import { RatingEditModal } from '../staffroom/contexts/providerRoles/rating-edit-modal';
import { AssetSuitabilityEditContext } from '../staffroom/contexts/providerRoles/rating-edit-context';
import { PropsWithChildren } from 'react';
import { useRatingEditModal } from '../staffroom/contexts/providerRoles/use-rating-edit-modal';
import {
  assetNameAccessor,
  assetRoleWorkTaskSuitabilityLabelAccessor,
  assetRoleWorkTaskSuitabilityRatingAccessor
} from './classroom-suitability/rating-table-accessor-functions';
import { AssetDto } from '../api/dtos/AssetDtoSchema';
const confirmRatingValue = () => {};

export default function AssetSuitabilityEditContextProvider({
  children
}: PropsWithChildren) {
  const { triggerModal, ratingEditModalProps } = useRatingEditModal({
    confirmRatingValue,
    ratingValueAccessor: assetRoleWorkTaskSuitabilityRatingAccessor,
    nameAccessor: assetNameAccessor,
    ratingCategoryLabelAccessor: assetRoleWorkTaskSuitabilityLabelAccessor
  });

  console.log('rendering edit context provider');

  return (
    <AssetSuitabilityEditContext.Provider value={{ triggerModal }}>
      {children}
      {<RatingEditModal {...ratingEditModalProps} />}
    </AssetSuitabilityEditContext.Provider>
  );
}
