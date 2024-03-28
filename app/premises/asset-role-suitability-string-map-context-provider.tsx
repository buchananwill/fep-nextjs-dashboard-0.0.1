'use client';

import { PropsWithChildren, useEffect } from 'react';
import { StringMap } from '../contexts/string-map-context/string-map-reducer';
import { AssetRoleWorkTaskSuitabilityDto } from '../api/dtos/AssetRoleWorkTaskSuitabilityDtoSchema';
import { StringMapContextProvider } from '../contexts/string-map-context/string-map-context-provider';
import { AccessorFunction } from '../generic/components/tables/rating/rating-table';
import {
  AssetRoleWorkTaskSuitabilityContext,
  AssetRoleWorkTaskSuitabilityDispatchContext
} from './asset-suitability-context-creator';
import { useSearchParams } from 'next/navigation';
import { useSelectiveContextDispatchNumberList } from '../generic/components/selective-context/selective-context-manager-number-list';
import { AssetSelectionListContextKey } from './classroom-suitability/asset-suitability-table-wrapper';
import { EmptyArray, isNotNull, isNotUndefined } from '../api/main';
import { parseTen } from '../api/date-and-time';

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
  const readonlyURLSearchParams = useSearchParams();
  const { dispatchWithoutControl, currentState } =
    useSelectiveContextDispatchNumberList({
      contextKey: AssetSelectionListContextKey,
      listenerKey: 'list-panel',
      initialValue: EmptyArray
    });

  useEffect(() => {
    const rootId = readonlyURLSearchParams?.get('rootId');
    if (isNotNull(rootId) && isNotUndefined(rootId)) {
      const idList = Object.keys(suitabilityLists).map(parseTen);
      if (idList.length < 20) {
        dispatchWithoutControl(idList);
      }
    }
  }, [dispatchWithoutControl, readonlyURLSearchParams, suitabilityLists]);

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
