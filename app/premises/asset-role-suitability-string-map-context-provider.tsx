'use client';

import { PropsWithChildren } from 'react';
import { StringMap } from '../contexts/string-map-context/string-map-reducer';
import { AssetRoleWorkTaskSuitabilityDto } from '../api/dtos/AssetRoleWorkTaskSuitabilityDtoSchema';
import { StringMapContextProvider } from '../contexts/string-map-context/string-map-context-provider';
import { AccessorFunction } from '../generic/components/tables/rating/rating-table';
import {
  AssetRoleWorkTaskSuitabilityContext,
  AssetRoleWorkTaskSuitabilityDispatchContext
} from './asset-suitability-context-creator';

export interface AssetRoleSuitabilityListContextProviderProps
  extends PropsWithChildren {
  suitabilityLists: StringMap<AssetRoleWorkTaskSuitabilityDto[]>;
}

const Provider = StringMapContextProvider<AssetRoleWorkTaskSuitabilityDto[]>;

export const AssetSuitabilityListKeyAccessor: AccessorFunction<
  AssetRoleWorkTaskSuitabilityDto[],
  string
> = (assetRoleSuitabilityList) => {
  return assetRoleSuitabilityList[0]?.assetId.toString();
};

export default function AssetRoleSuitabilityStringMapContextProvider({
  children,
  suitabilityLists
}: AssetRoleSuitabilityListContextProviderProps) {
  return (
    <Provider
      initialEntityMap={suitabilityLists}
      mapKeyAccessor={AssetSuitabilityListKeyAccessor}
      mapContext={AssetRoleWorkTaskSuitabilityContext}
      dispatchContext={AssetRoleWorkTaskSuitabilityDispatchContext}
    >
      {children}
    </Provider>
  );
}
