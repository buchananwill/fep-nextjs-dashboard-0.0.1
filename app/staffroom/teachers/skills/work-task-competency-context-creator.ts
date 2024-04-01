'use client';

import { createStringMapContext } from '../../../contexts/string-map-context/context-creator';
import { useContext } from 'react';
import { WorkTaskCompetencyDto } from '../../../api/dtos/WorkTaskCompetencyDtoSchema';
import { ProviderRoleTypeWorkTaskTypeSuitabilityDto } from '../../../api/dtos/ProviderRoleTypeWorkTaskTypeSuitabilityDtoSchema';

export const {
  mapContext: ProviderRoleTypeWorkTaskTypeSuitabilityListContext,
  dispatchContext: ProviderRoleTypeWorkTaskTypeSuitabilityListDispatchContext
} = createStringMapContext<ProviderRoleTypeWorkTaskTypeSuitabilityDto[]>();

export function useProviderRoleTypeWorkTaskTypeSuitabilityListStringMapContext() {
  const stringMap = useContext(
    ProviderRoleTypeWorkTaskTypeSuitabilityListContext
  );
  const stringMapDispatch = useContext(
    ProviderRoleTypeWorkTaskTypeSuitabilityListDispatchContext
  );

  return {
    providerRoleTypeWorkTaskTypeSuitabilityListStringMap: stringMap,
    providerRoleTypeWorkTaskTypeSuitabilityListStringMapDispatch:
      stringMapDispatch
  };
}
