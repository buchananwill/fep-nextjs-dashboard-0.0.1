import React, { ReactNode } from 'react';
import ProviderRoleSkillEditContextProvider from './contexts/providerRoles/provider-role-skill-edit-context-provider';
import AvailabilityContextProvider from './contexts/availability/availability-context-provider';
import { TeachersToolCard } from './teachers-tool-card';
import { ProviderRoleDto } from '../api/dtos/ProviderRoleDtoSchema';
import { performApiAction } from '../api/actions/performApiAction';
import { getTeachers } from '../api/actions/provider-roles';
import { WorkTaskTypeDto } from '../api/dtos/WorkTaskTypeDtoSchema';
import { getWorkTaskTypes } from '../api/actions/work-task-types';
import { SECONDARY_EDUCATION_CATEGORY_ID } from '../api/main';
import { CycleSubspanDto } from '../api/dtos/CycleSubspanDtoSchema';
import { getAvailabilities } from '../api/actions/availability';
import { ProviderAvailabilityDto } from '../api/dtos/ProviderAvailabilityDtoSchema';
import { getCycleModel } from '../api/actions/cycle-model';
import { CycleDto } from '../api/dtos/CycleDtoSchema';
import { CycleModelMock } from './contexts/availability/availability-context';
import CalendarRangeContextProvider from '../generic/components/calendar/range/calendar-range-context-provider';
import ProviderRoleStringMapContextProvider from './contexts/providerRoles/provider-role-string-map-context-provider';
import { convertListToStringMap } from '../contexts/string-map-context/convert-list-to-string-map';
import { IdStringFromNumberAccessor } from '../premises/classroom-suitability/rating-table-accessor-functions';
import { WorkTaskTypeContextProvider } from '../curriculum/delivery-models/contexts/work-task-type-context-provider';
import { ProviderRoleColorCodingContextProvider } from './provider-role-color-coding-context-provider';
import ProviderRoleSelectionContextProvider from './contexts/providerRoles/provider-role-selection-context-provider';
import ToolCardContextProvider from '../generic/components/tool-card/tool-card-context-provider';

export const dynamic = 'force-dynamic';

export default async function StaffroomLayout({
  children
}: {
  children: ReactNode;
}) {
  const teacherList: ProviderRoleDto[] = [];
  await performApiAction(() => getTeachers()).then((r) => {
    if (r.data) {
      const teacherDtos = r.data;

      for (const teacherDto of teacherDtos) {
        teacherList.push(teacherDto);
      }
    }
  });

  let workTaskTypeDtos: WorkTaskTypeDto[] = [];

  const { data: workTaskTypeDtosOptional } = await getWorkTaskTypes({
    serviceCategoryDto: SECONDARY_EDUCATION_CATEGORY_ID.toString()
  });

  if (workTaskTypeDtosOptional) {
    workTaskTypeDtos = workTaskTypeDtosOptional;
  }
  let availabilityUnits: CycleSubspanDto[] = [];
  let cycleModel: CycleDto = CycleModelMock;
  const { data } = await getCycleModel();
  if (data !== undefined) {
    availabilityUnits = data.cycleSubspans;
    cycleModel = data;
  }

  const availabilityMap = new Map<number, ProviderAvailabilityDto[]>();
  for (let providerRoleDto of teacherList) {
    const { data } = await getAvailabilities(providerRoleDto.id);
    if (data) availabilityMap.set(providerRoleDto.id, data);
  }

  teacherList.forEach(
    (teacher) =>
      (teacher.workTaskCompetencyDtoList =
        teacher.workTaskCompetencyDtoList.sort((wtt1, wtt2) =>
          wtt1.workTaskType.localeCompare(wtt2.workTaskType)
        ))
  );

  const providerRoleStringMap = convertListToStringMap(
    teacherList,
    IdStringFromNumberAccessor
  );
  const workTaskTypeStringMap = convertListToStringMap(
    workTaskTypeDtos,
    IdStringFromNumberAccessor
  );

  return (
    <WorkTaskTypeContextProvider entityMap={workTaskTypeStringMap}>
      <AvailabilityContextProvider
        initialData={{
          cycleModel,
          cycleAvailabilityUnits: availabilityUnits,
          providerAvailability: availabilityMap,
          unsavedChanges: false,
          dndMap: {}
        }}
      >
        <ProviderRoleStringMapContextProvider
          providerRoleStringMap={providerRoleStringMap}
        >
          <ProviderRoleSelectionContextProvider>
            <ProviderRoleSkillEditContextProvider>
              <ProviderRoleColorCodingContextProvider>
                <CalendarRangeContextProvider>
                  <div className="flex w-[100%] gap-2">
                    <ToolCardContextProvider>
                      <TeachersToolCard />
                    </ToolCardContextProvider>

                    {children}
                  </div>
                </CalendarRangeContextProvider>
              </ProviderRoleColorCodingContextProvider>
            </ProviderRoleSkillEditContextProvider>
          </ProviderRoleSelectionContextProvider>
        </ProviderRoleStringMapContextProvider>
      </AvailabilityContextProvider>
    </WorkTaskTypeContextProvider>
  );
}
