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
import { patchPremises } from '../api/actions/premises';
import { AssetSuitabilityListSelectiveContext } from '../contexts/selective-context/selective-context-creators';
import { useSelectiveContextListenerReadAll } from '../selective-context/components/base/generic-selective-context-creator';

const Provider = WriteableStringMapContextProvider<AssetDto>;
export default function AssetStringMapContextProvider({
  assetStringMap,
  children
}: { assetStringMap: StringMap<AssetDto> } & PropsWithChildren) {
  const selectiveContextReadAll = useSelectiveContextListenerReadAll(
    AssetSuitabilityListSelectiveContext
  );
  const commitServerAction = useCallback(
    (changedAssetDtoList: AssetDto[]) => {
      const assetDtoListWithUpdatedLists = changedAssetDtoList.map(
        (assetDto) => {
          const newVar = selectiveContextReadAll(assetDto.id.toString());
          return {
            ...assetDto,
            assetRoleWorkTaskSuitabilities:
              newVar !== undefined
                ? newVar
                : assetDto.assetRoleWorkTaskSuitabilities
          };
        }
      );
      return patchPremises(assetDtoListWithUpdatedLists);
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
