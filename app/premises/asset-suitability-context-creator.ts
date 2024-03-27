import { createStringMapContext } from '../contexts/string-map-context/context-creator';
import { AssetRoleWorkTaskSuitabilityDto } from '../api/dtos/AssetRoleWorkTaskSuitabilityDtoSchema';
import { useContext } from 'react';

export const {
  mapContext: AssetRoleWorkTaskSuitabilityContext,
  dispatchContext: AssetRoleWorkTaskSuitabilityDispatchContext
} = createStringMapContext<AssetRoleWorkTaskSuitabilityDto[]>();

export function useAssetSuitabilityStringMapContext() {
  const assetSuitabilityStringMap = useContext(
    AssetRoleWorkTaskSuitabilityContext
  );
  const assetSuitabilityStringMapDispatch = useContext(
    AssetRoleWorkTaskSuitabilityDispatchContext
  );

  return { assetSuitabilityStringMap, assetSuitabilityStringMapDispatch };
}
