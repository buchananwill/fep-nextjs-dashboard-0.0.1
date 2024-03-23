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

const Provider = StringMapEditContextProvider<AssetDto>;

export default function AssetStringMapContextProvider({
  assetStringMap,
  children
}: { assetStringMap: StringMap<AssetDto> } & PropsWithChildren) {
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
      {children}
    </Provider>
  );
}
