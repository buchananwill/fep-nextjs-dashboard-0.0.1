'use client';
import { PropsWithChildren, useEffect } from 'react';
import { StringMap } from '../../../contexts/string-map-context/string-map-reducer';
import { StringMapContextProvider } from '../../../contexts/string-map-context/string-map-context-provider';
import { AccessorFunction } from '../../../generic/components/tables/rating/rating-table';
import { useSearchParams } from 'next/navigation';
import { useSelectiveContextDispatchNumberList } from '../../../selective-context/components/typed/selective-context-manager-number-list';
import { EmptyArray, isNotNull, isNotUndefined } from '../../../api/main';
import { parseTen } from '../../../api/date-and-time';
import { ProviderRoleSelectionList } from '../provider-role-disclosure-list-panel/provider-role-button-cluster';
import { WorkTaskCompetencyDto } from '../../../api/dtos/WorkTaskCompetencyDtoSchema';
import {
  ProviderRoleTypeWorkTaskTypeSuitabilityListContext,
  ProviderRoleTypeWorkTaskTypeSuitabilityListDispatchContext
} from './work-task-competency-context-creator';
import { ProviderRoleTypeWorkTaskTypeSuitabilityDto } from '../../../api/dtos/ProviderRoleTypeWorkTaskTypeSuitabilityDtoSchema';

export interface ProviderRoleTypeWorkTaskTypeSuitabilityListContextProviderProps
  extends PropsWithChildren {
  competencyLists: StringMap<ProviderRoleTypeWorkTaskTypeSuitabilityDto[]>;
}

const Provider = StringMapContextProvider<
  ProviderRoleTypeWorkTaskTypeSuitabilityDto[]
>;

export const WorkTaskCompetencyListKeyAccessor: AccessorFunction<
  ProviderRoleTypeWorkTaskTypeSuitabilityDto[],
  string
> = (workTaskCompetencyList) => {
  return workTaskCompetencyList[0]?.partyId.toString();
};

export default function WorkTaskCompetencyStringMapContextProvider({
  children,
  competencyLists
}: ProviderRoleTypeWorkTaskTypeSuitabilityListContextProviderProps) {
  return (
    <Provider
      initialEntityMap={competencyLists}
      mapKeyAccessor={WorkTaskCompetencyListKeyAccessor}
      mapContext={ProviderRoleTypeWorkTaskTypeSuitabilityListContext}
      dispatchContext={
        ProviderRoleTypeWorkTaskTypeSuitabilityListDispatchContext
      }
    >
      {children}
    </Provider>
  );
}
