'use client';

import { ProviderRoleDto } from '../../../api/dtos/ProviderRoleDtoSchema';
import { WriteableStringMapContextProvider } from '../../../contexts/string-map-context/writeable-string-map-context-provider';
import { StringMap } from '../../../contexts/string-map-context/string-map-reducer';
import { PropsWithChildren, useCallback } from 'react';
import { ProviderRoleTypeWorkTaskTypeSuitabilityListSelectiveContext } from '../../../contexts/selective-context/selective-context-creators';
import {
  patchWorkTaskSuitabilities,
  updateTeachers
} from '../../../api/actions/custom/provider-roles';
import {
  ProviderChangesProviderListener,
  ProviderRoleStringMapContext,
  ProviderRoleStringMapDispatchContext,
  UnsavedProviderRoleChanges
} from './provider-role-string-map-context-creator';
import { useSelectiveContextListenerReadAll } from '../../../selective-context/components/base/generic-selective-context-creator';
import { isNotUndefined } from '../../../api/main';

const Provider = WriteableStringMapContextProvider<ProviderRoleDto>;
export default function ProviderRoleStringMapContextProvider({
  providerRoleStringMap,
  children
}: { providerRoleStringMap: StringMap<ProviderRoleDto> } & PropsWithChildren) {
  const selectiveContextReadAll = useSelectiveContextListenerReadAll(
    ProviderRoleTypeWorkTaskTypeSuitabilityListSelectiveContext
  );

  const commitServerAction = useCallback(
    (changedProviderRoleDtoList: ProviderRoleDto[]) => {
      const updateLists = changedProviderRoleDtoList
        .map((providerRoleDto) => {
          return selectiveContextReadAll(providerRoleDto.id.toString());
        })
        .filter(isNotUndefined)
        .reduce((prev, curr) => [...prev, ...curr], []);
      patchWorkTaskSuitabilities(updateLists);
      return updateTeachers(changedProviderRoleDtoList);
    },
    [selectiveContextReadAll]
  );

  return (
    <Provider
      dispatchContext={ProviderRoleStringMapDispatchContext}
      mapContext={ProviderRoleStringMapContext}
      commitServerAction={commitServerAction}
      unsavedChangesEntityKey={UnsavedProviderRoleChanges}
      initialEntityMap={providerRoleStringMap}
      mapKeyAccessor={(asset) => asset.id.toString()}
      providerListenerKey={ProviderChangesProviderListener}
    >
      {children}
    </Provider>
  );
}
