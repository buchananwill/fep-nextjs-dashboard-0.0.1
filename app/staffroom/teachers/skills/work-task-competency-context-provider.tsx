'use client';
import { PropsWithChildren, useEffect } from 'react';
import { StringMap } from '../../../contexts/string-map-context/string-map-reducer';
import { StringMapContextProvider } from '../../../contexts/string-map-context/string-map-context-provider';
import { AccessorFunction } from '../../../generic/components/tables/rating/rating-table';
import { useSearchParams } from 'next/navigation';
import { useSelectiveContextDispatchNumberList } from '../../../generic/components/selective-context/selective-context-manager-number-list';
import { EmptyArray, isNotNull, isNotUndefined } from '../../../api/main';
import { parseTen } from '../../../api/date-and-time';
import { ProviderRoleSelectionList } from '../provider-role-disclosure-list-panel/provider-role-button-cluster';
import { WorkTaskCompetencyDto } from '../../../api/dtos/WorkTaskCompetencyDtoSchema';
import {
  WorkTaskCompetencyListContext,
  WorkTaskCompetencyListDispatchContext
} from './work-task-competency-context-creator';

export interface WorkTaskCompetencyListContextProviderProps
  extends PropsWithChildren {
  competencyLists: StringMap<WorkTaskCompetencyDto[]>;
}

const Provider = StringMapContextProvider<WorkTaskCompetencyDto[]>;

export const WorkTaskCompetencyListKeyAccessor: AccessorFunction<
  WorkTaskCompetencyDto[],
  string
> = (workTaskCompetencyList) => {
  return workTaskCompetencyList[0]?.providerRoleId.toString();
};

export default function WorkTaskCompetencyStringMapContextProvider({
  children,
  competencyLists
}: WorkTaskCompetencyListContextProviderProps) {
  return (
    <Provider
      initialEntityMap={competencyLists}
      mapKeyAccessor={WorkTaskCompetencyListKeyAccessor}
      mapContext={WorkTaskCompetencyListContext}
      dispatchContext={WorkTaskCompetencyListDispatchContext}
    >
      {children}
    </Provider>
  );
}
