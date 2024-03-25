import { createStringMapContext } from '../../../components/string-map-context/context-creator';
import { AssetDto } from '../../../api/dtos/AssetDtoSchema';
import { useContext } from 'react';
import { ProviderRoleDto } from '../../../api/dtos/ProviderRoleDtoSchema';

export const UnsavedProviderRoleChanges = 'unsaved-provider-role-changes';

const {
  mapContext: ProviderRoleStringMapContext,
  dispatchContext: ProviderRoleStringMapDispatchContext
} = createStringMapContext<ProviderRoleDto>();

export { ProviderRoleStringMapContext, ProviderRoleStringMapDispatchContext };

export const ProviderChangesProviderListener = 'provider';

export const ProviderCommitKey = 'commit-asset-changes-open';

export function useProviderRoleStringMapContext() {
  const providerRoleDtoStringMap = useContext(ProviderRoleStringMapContext);
  const providerRoleDtoStringMapDispatch = useContext(
    ProviderRoleStringMapDispatchContext
  );

  return { providerRoleDtoStringMap, providerRoleDtoStringMapDispatch };
}
