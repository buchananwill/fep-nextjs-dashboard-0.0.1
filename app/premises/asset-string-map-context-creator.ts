'use client';
import { createStringMapContext } from '../contexts/string-map-context/context-creator';
import { AssetDto } from '../api/dtos/AssetDtoSchema';
import { useContext } from 'react';

const {
  mapContext: AssetStringMapContext,
  dispatchContext: AssetStringMapDispatchContext
} = createStringMapContext<AssetDto>();

export { AssetStringMapContext, AssetStringMapDispatchContext };

export const UnsavedAssetChanges = 'unsaved-asset-changes';
export const AssetChangesProviderListener = 'asset-provider';
export function useAssetStringMapContext() {
  const assetDtoStringMap = useContext(AssetStringMapContext);
  const assetDtoStringMapDispatch = useContext(AssetStringMapDispatchContext);

  return { assetDtoStringMap, assetDtoStringMapDispatch };
}
