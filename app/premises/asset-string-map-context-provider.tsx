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
import { PropsWithChildren, useContext } from 'react';
import { patchPremises } from '../api/actions/premises';
import { AssetSuitabilityListSelectiveContext } from '../components/selective-context/typed/selective-context-creators';

const Provider = StringMapEditContextProvider<AssetDto>;
export default function AssetStringMapContextProvider({
  assetStringMap,
  children
}: { assetStringMap: StringMap<AssetDto> } & PropsWithChildren) {
  const mutableRefObject = useContext(
    AssetSuitabilityListSelectiveContext.latestValueRefContext
  );
  const commitServerAction = (changedAssetDtos: AssetDto[]) => {
    const latestLists = mutableRefObject.current;
    const assetDtosWithUpdatedLists = changedAssetDtos.map((assetDto) => ({
      ...assetDto,
      assetRoleWorkTaskSuitabilities: latestLists[assetDto.id.toString()]
    }));
    return patchPremises(assetDtosWithUpdatedLists);
  };

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
