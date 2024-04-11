import { WorkTaskTypeContextProvider } from '../../../curriculum/delivery-models/contexts/work-task-type-context-provider';
import { getWorkTaskTypes } from '../../../api/actions/custom/work-task-types';
import SkillTableWrapper from './skill-table-wrapper';
import { convertListToStringMap } from '../../../contexts/string-map-context/convert-list-to-string-map';
import { IdStringFromNumberAccessor } from '../../../premises/classroom-suitability/rating-table-accessor-functions';
import { EmptyArray, isNotUndefined } from '../../../api/main';
import ProviderRoleSkillEditContextProvider from '../../contexts/providerRoles/provider-role-skill-edit-context-provider';
import { getWorkTaskTypeIdsAlphabetical } from '../../../premises/classroom-suitability/get-work-task-type-ids-alphabetical';
import { DataNotFoundCard } from '../../../timetables/students/[schedule]/data-not-found-card';
import { parseTen } from '../../../api/date-and-time';
import WorkTaskCompetencyStringMapContextProvider from './work-task-competency-context-provider';
import { TeachersToolCard } from '../../teachers-tool-card';
import ToolCardContextProvider from '../../../generic/components/tool-card/tool-card-context-provider';
import React from 'react';
import ProviderRoleStringMapContextProvider from '../../contexts/providerRoles/provider-role-string-map-context-provider';
import { getAll } from '../../../api/READ-ONLY-generated-actions/ProviderRoleType';
import { getByTypeIdList } from '../../../api/READ-ONLY-generated-actions/ProviderRole';
import { getTriIntersectionTable } from '../../../api/READ-ONLY-generated-actions/ProviderRoleTypeWorkTaskTypeSuitability';

export default async function SkillsPage({
  searchParams
}: {
  searchParams: {
    serviceCategoryDto?: string;
    knowledgeDomain?: string;
    knowledgeLevelOrdinal?: string;
  };
}) {
  const teacherRoleType = await getAll().then((r) => {
    if (isNotUndefined(r.data)) {
      return r.data.find(
        (roleType) => roleType.name.toLowerCase() === 'teacher'
      );
    }
  });

  if (!isNotUndefined(teacherRoleType)) {
    return <DataNotFoundCard>Teacher role not found!</DataNotFoundCard>;
  }
  const actionResponse = await getByTypeIdList([teacherRoleType.id]);

  const providerRoles = actionResponse.data;

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
  const partyIdList = Object.values(providerRoleStringMap).map(
    (suitability) => suitability.partyId
  );

  const { data: workTaskCompetencies } = await getTriIntersectionTable(
    partyIdList,
    workTaskTypeIdsAlphabetical,
    teacherRoleType.id
  );

  if (!isNotUndefined(workTaskCompetencies)) {
    return (
      <DataNotFoundCard>No work task competencies found.</DataNotFoundCard>
    );
  }
  return (
    <WorkTaskTypeContextProvider entityMap={workTaskTypeStringMap}>
      <WorkTaskCompetencyStringMapContextProvider
        competencyLists={workTaskCompetencies}
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
