'use client';
import { StringMapEditContextProvider } from '../components/string-map-context/string-map-edit-context-provider';
import { AssetDto } from '../api/dtos/AssetDtoSchema';
import {
  AssetChangesProviderListener,
  AssetCommitKey,
  AssetStringMapContext,
  AssetStringMapDispatchContext,
  UnsavedAssetChanges
} from './asset-string-map-context-creator';
import { errorResponse } from '../api/actions/actionResponse';
import { AssetSuitabilityTableWrapper } from './classroom-suitability/asset-suitability-table-wrapper';
import { StringMap } from '../curriculum/delivery-models/contexts/string-map-context-creator';
import { PropsWithChildren } from 'react';
import { useRatingEditModal } from '../staffroom/contexts/providerRoles/use-rating-edit-modal';
import {
  assetRoleWorkTaskSuitabilityLabelAccessor,
  assetRoleWorkTaskSuitabilityRatingAccessor
} from './classroom-suitability/rating-table-accessor-functions';
import { AssetSuitabilityEditContext } from '../staffroom/contexts/providerRoles/rating-edit-context';
import { RatingEditModal } from '../staffroom/contexts/providerRoles/rating-edit-modal';

const Provider = StringMapEditContextProvider<AssetDto>;

export default function AssetStringMapContextProvider({
  assetStringMap,
  children
}: { assetStringMap: StringMap<AssetDto> } & PropsWithChildren) {
  const confirmRatingValue = () => {};

  const { triggerModal, elementInModal, ratingEditModalProps } =
    useRatingEditModal({
      confirmRatingValue,
      ratingValueAccessor: assetRoleWorkTaskSuitabilityRatingAccessor,
      nameAccessor: (asset: AssetDto) => asset.name,
      ratingCategoryLabelAccessor: assetRoleWorkTaskSuitabilityLabelAccessor
    });

  return (
    <Provider
      dispatchContext={AssetStringMapDispatchContext}
      mapContext={AssetStringMapContext}
      entityTypeCommitKey={AssetCommitKey}
      commitServerAction={async (entityList) =>
        errorResponse('Not implemented')
      }
      unsavedChangesEntityKey={UnsavedAssetChanges}
      initialEntityMap={assetStringMap}
      mapKeyAccessor={(asset) => asset.id.toString()}
      providerListenerKey={AssetChangesProviderListener}
    >
      <AssetSuitabilityEditContext.Provider value={{ triggerModal }}>
        {children}
        {elementInModal && <RatingEditModal {...ratingEditModalProps} />}
      </AssetSuitabilityEditContext.Provider>
    </Provider>
  );
}
