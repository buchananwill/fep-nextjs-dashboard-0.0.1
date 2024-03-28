import { WorkTaskTypeContextProvider } from '../../../curriculum/delivery-models/contexts/work-task-type-context-provider';
import { getWorkTaskTypes } from '../../../api/actions/work-task-types';
import SkillTableWrapper from './skill-table-wrapper';
import { convertListToStringMap } from '../../../contexts/string-map-context/convert-list-to-string-map';
import { IdStringFromNumberAccessor } from '../../../premises/classroom-suitability/rating-table-accessor-functions';
import { EmptyArray, isNotUndefined } from '../../../api/main';
import ProviderRoleSkillEditContextProvider from '../../contexts/providerRoles/provider-role-skill-edit-context-provider';
import {
  getTeachers,
  getWorkTaskCompetencies
} from '../../../api/actions/provider-roles';
import { getWorkTaskTypeIdsAlphabetical } from '../../../premises/classroom-suitability/get-work-task-type-ids-alphabetical';
import { DataNotFoundCard } from '../../../timetables/students/[schedule]/data-not-found-card';
import { parseTen } from '../../../api/date-and-time';
import WorkTaskCompetencyStringMapContextProvider, {
  WorkTaskCompetencyListKeyAccessor
} from './work-task-competency-context-provider';
import { TeachersToolCard } from '../../teachers-tool-card';
import ToolCardContextProvider from '../../../generic/components/tool-card/tool-card-context-provider';
import React from 'react';
import ProviderRoleStringMapContextProvider from '../../contexts/providerRoles/provider-role-string-map-context-provider';

export default async function SkillsPage({
  searchParams
}: {
  searchParams: {
    serviceCategoryDto?: string;
    knowledgeDomain?: string;
    knowledgeLevelOrdinal?: string;
  };
}) {
  const { data: providerRoles } = await getTeachers();

  if (!isNotUndefined(providerRoles))
    return <DataNotFoundCard>No Teachers!</DataNotFoundCard>;

  const { data: workTaskTypeDtos } = await getWorkTaskTypes(searchParams);

  const workTaskTypeStringMap = convertListToStringMap(
    workTaskTypeDtos || EmptyArray,
    IdStringFromNumberAccessor
  );

  const providerRoleStringMap = convertListToStringMap(
    providerRoles,
    IdStringFromNumberAccessor
  );

  const workTaskTypeIdsAlphabetical = getWorkTaskTypeIdsAlphabetical(
    workTaskTypeStringMap
  );
  const providerRoleIds = Object.keys(providerRoleStringMap).map(parseTen);

  const { data: workTaskCompetencies } = await getWorkTaskCompetencies(
    providerRoleIds,
    workTaskTypeIdsAlphabetical
  );

  if (!isNotUndefined(workTaskCompetencies)) {
    return (
      <DataNotFoundCard>No work task competencies found.</DataNotFoundCard>
    );
  }
  return (
    <WorkTaskTypeContextProvider entityMap={workTaskTypeStringMap}>
      <WorkTaskCompetencyStringMapContextProvider
        competencyLists={workTaskCompetencies.table}
      >
        <ProviderRoleStringMapContextProvider
          providerRoleStringMap={providerRoleStringMap}
        >
          <ProviderRoleSkillEditContextProvider>
            <ToolCardContextProvider>
              <TeachersToolCard />
            </ToolCardContextProvider>
            <SkillTableWrapper />
          </ProviderRoleSkillEditContextProvider>
        </ProviderRoleStringMapContextProvider>
      </WorkTaskCompetencyStringMapContextProvider>
    </WorkTaskTypeContextProvider>
  );
}
