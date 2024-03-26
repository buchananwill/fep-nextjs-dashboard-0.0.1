'use client';

import { ProviderRoleDto } from '../../../api/dtos/ProviderRoleDtoSchema';
import { StringMapEditContextProvider } from '../../../contexts/string-map-context/string-map-edit-context-provider';
import { StringMap } from '../../../curriculum/delivery-models/contexts/string-map-context-creator';
import { PropsWithChildren, useCallback } from 'react';
import { WorkTaskCompetencyListSelectiveContext } from '../../../contexts/selective-context/selective-context-creators';
import { updateTeachers } from '../../../api/actions/provider-roles';
import {
  ProviderChangesProviderListener,
  ProviderRoleStringMapContext,
  ProviderRoleStringMapDispatchContext,
  UnsavedProviderRoleChanges
} from './provider-role-string-map-context-creator';
import { useSelectiveContextListenerReadAll } from '../../../generic/components/selective-context/generic-selective-context-creator';
import { isNotUndefined } from '../../../api/main';

const Provider = StringMapEditContextProvider<ProviderRoleDto>;
export default function ProviderRoleStringMapContextProvider({
  providerRoleStringMap,
  children
}: { providerRoleStringMap: StringMap<ProviderRoleDto> } & PropsWithChildren) {
  const selectiveContextReadAll = useSelectiveContextListenerReadAll(
    WorkTaskCompetencyListSelectiveContext
  );

  const commitServerAction = useCallback(
    (changedProviderRoleDtoList: ProviderRoleDto[]) => {
      const providerRoleDtoListWithUpdatedRatingLists =
        changedProviderRoleDtoList.map((providerRoleDto) => {
          const updatedList = selectiveContextReadAll(
            providerRoleDto.id.toString()
          );

          return {
            ...providerRoleDto,
            workTaskCompetencyDtoList: isNotUndefined(updatedList)
              ? updatedList
              : providerRoleDto.workTaskCompetencyDtoList
          };
        });
      return updateTeachers(providerRoleDtoListWithUpdatedRatingLists);
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
