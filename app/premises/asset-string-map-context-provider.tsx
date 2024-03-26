'use client';
import { StringMapEditContextProvider } from '../components/string-map-context/string-map-edit-context-provider';
import { AssetDto } from '../api/dtos/AssetDtoSchema';
import {
  AssetChangesProviderListener,
  AssetStringMapContext,
  AssetStringMapDispatchContext,
  UnsavedAssetChanges
} from './asset-string-map-context-creator';
import { StringMap } from '../curriculum/delivery-models/contexts/string-map-context-creator';
import { PropsWithChildren, useCallback, useContext } from 'react';
import { patchPremises } from '../api/actions/premises';
import { AssetSuitabilityListSelectiveContext } from '../components/selective-context/typed/selective-context-creators';
import { useSelectiveContextListenerReadAll } from '../generic/components/selective-context/generic-selective-context-creator';

const Provider = StringMapEditContextProvider<AssetDto>;
export default function AssetStringMapContextProvider({
  assetStringMap,
  children
}: { assetStringMap: StringMap<AssetDto> } & PropsWithChildren) {
  const selectiveContextReadAll = useSelectiveContextListenerReadAll(
    AssetSuitabilityListSelectiveContext
  );
  const commitServerAction = useCallback(
    (changedAssetDtos: AssetDto[]) => {
      const assetDtosWithUpdatedLists = changedAssetDtos.map((assetDto) => {
        const newVar = selectiveContextReadAll(assetDto.id.toString());
        return {
          ...assetDto,
          assetRoleWorkTaskSuitabilities:
            newVar !== undefined
              ? newVar
              : assetDto.assetRoleWorkTaskSuitabilities
        };
      });
      return patchPremises(assetDtosWithUpdatedLists);
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
