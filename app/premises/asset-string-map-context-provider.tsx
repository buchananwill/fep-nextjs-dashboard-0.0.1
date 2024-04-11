'use client';
import { WriteableStringMapContextProvider } from '../contexts/string-map-context/writeable-string-map-context-provider';
import { AssetDto } from '../api/dtos/AssetDtoSchema';
import {
  AssetChangesProviderListener,
  AssetStringMapContext,
  AssetStringMapDispatchContext,
  UnsavedAssetChanges
} from './asset-string-map-context-creator';
import { StringMap } from '../contexts/string-map-context/string-map-reducer';
import { PropsWithChildren, useCallback } from 'react';
import {
  patchAssetRoleWorkTaskSuitabilities,
  patchPremises
} from '../api/actions/custom/premises';
import { AssetSuitabilityListSelectiveContext } from '../contexts/selective-context/selective-context-creators';
import { useSelectiveContextListenerReadAll } from '../selective-context/components/base/generic-selective-context-creator';
import { isNotUndefined } from '../api/main';

const Provider = WriteableStringMapContextProvider<AssetDto>;
export default function AssetStringMapContextProvider({
  assetStringMap,
  children
}: { assetStringMap: StringMap<AssetDto> } & PropsWithChildren) {
  const selectiveContextReadAll = useSelectiveContextListenerReadAll(
    AssetSuitabilityListSelectiveContext
  );
  const commitServerAction = useCallback(
    async (changedAssetDtoList: AssetDto[]) => {
      const updatedSuitabilityLists = changedAssetDtoList
        .map((assetDto) => selectiveContextReadAll(assetDto.id.toString()))
        .filter(isNotUndefined)
        .reduce((prev, curr) => [...prev, ...curr], []);
      await patchAssetRoleWorkTaskSuitabilities(updatedSuitabilityLists);
      return await patchPremises(changedAssetDtoList);
    },
    [selectiveContextReadAll]
  );

  return (
    <Provider
      dispatchContext={AssetStringMapDispatchContext}
      mapContext={AssetStringMapContext}
      commitServerAction={commitServerAction}
      unsavedChangesEntityKey={UnsavedAssetChanges}
      initialEntityMap={assetStringMap}
      mapKeyAccessor={(asset) => asset.id.toString()}
      providerListenerKey={AssetChangesProviderListener}
    >
      {children}
    </Provider>
  );
}
