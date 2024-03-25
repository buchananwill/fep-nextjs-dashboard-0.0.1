'use client';

import { ProviderRoleDto } from '../../../api/dtos/ProviderRoleDtoSchema';
import { StringMapEditContextProvider } from '../../../components/string-map-context/string-map-edit-context-provider';
import { StringMap } from '../../../curriculum/delivery-models/contexts/string-map-context-creator';
import { PropsWithChildren, useContext } from 'react';
import { WorkTaskCompetencyListSelectiveContext } from '../../../components/selective-context/typed/selective-context-creators';
import { updateTeachers } from '../../../api/actions/provider-roles';
import {
  ProviderChangesProviderListener,
  ProviderRoleStringMapContext,
  ProviderRoleStringMapDispatchContext,
  UnsavedProviderRoleChanges
} from './provider-role-string-map-context-creator';

const Provider = StringMapEditContextProvider<ProviderRoleDto>;
export default function ProviderRoleStringMapContextProvider({
  providerRoleStringMap,
  children
}: { providerRoleStringMap: StringMap<ProviderRoleDto> } & PropsWithChildren) {
  const mutableRefObject = useContext(
    WorkTaskCompetencyListSelectiveContext.latestValueRefContext
  );
  const commitServerAction = (changedProviderRoleDtos: ProviderRoleDto[]) => {
    const latestLists = mutableRefObject.current;
    const providerRoleDtosWithUpdatedLists = changedProviderRoleDtos.map(
      (providerRoleDto) => ({
        ...providerRoleDto,
        assetRoleWorkTaskSuitabilities:
          latestLists[providerRoleDto.id.toString()]
      })
    );
    return updateTeachers(providerRoleDtosWithUpdatedLists);
  };

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
