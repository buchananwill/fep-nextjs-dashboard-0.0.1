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
import { StringMap } from '../curriculum/delivery-models/contexts/string-map-context-creator';
import { PropsWithChildren } from 'react';
import AssetSuitabilityEditContextProvider from './asset-suitability-edit-context-provider';

const Provider = StringMapEditContextProvider<AssetDto>;

export default function AssetStringMapContextProvider({
  assetStringMap,
  children
}: { assetStringMap: StringMap<AssetDto> } & PropsWithChildren) {
  return (
    <Provider
      dispatchContext={AssetStringMapDispatchContext}
      mapContext={AssetStringMapContext}
      commitServerAction={async (entityList) => {
        console.log('committing asset dto list');
        return errorResponse('Not implemented');
      }}
      unsavedChangesEntityKey={UnsavedAssetChanges}
      initialEntityMap={assetStringMap}
      mapKeyAccessor={(asset) => asset.id.toString()}
      providerListenerKey={AssetChangesProviderListener}
    >
      {children}
    </Provider>
  );
}
