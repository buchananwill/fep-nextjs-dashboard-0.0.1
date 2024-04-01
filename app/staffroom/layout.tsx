import React, { ReactNode } from 'react';
import AvailabilityContextProvider from './contexts/availability/availability-context-provider';
import { TeachersToolCard } from './teachers-tool-card';
import { ProviderRoleDto } from '../api/dtos/ProviderRoleDtoSchema';
import { performApiAction } from '../api/actions/performApiAction';
import { getTeachers } from '../api/actions/provider-roles';
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
import { ProviderRoleColorCodingContextProvider } from './provider-role-color-coding-context-provider';
import ToolCardContextProvider from '../generic/components/tool-card/tool-card-context-provider';

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

  const providerRoleStringMap = convertListToStringMap(
    teacherList,
    IdStringFromNumberAccessor
  );

  return (
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
        <ProviderRoleColorCodingContextProvider>
          <CalendarRangeContextProvider>
            <div className="flex w-[100%] gap-2">{children}</div>
          </CalendarRangeContextProvider>
        </ProviderRoleColorCodingContextProvider>
      </ProviderRoleStringMapContextProvider>
    </AvailabilityContextProvider>
  );
}
