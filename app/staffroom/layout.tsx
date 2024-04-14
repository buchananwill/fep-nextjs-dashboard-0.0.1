import React, { ReactNode } from 'react';
import AvailabilityContextProvider from './contexts/availability/availability-context-provider';
import { ProviderRoleDto } from '../api/dtos/ProviderRoleDtoSchema';
import { getTeachersV2 } from '../api/actions/custom/provider-roles';
import { CycleSubspanDto } from '../api/dtos/CycleSubspanDtoSchema';
import { CycleDto } from '../api/dtos/CycleDtoSchema';
import { CycleModelMock } from './contexts/availability/availability-context';
import CalendarRangeContextProvider from '../generic/components/calendar/range/calendar-range-context-provider';
import ProviderRoleStringMapContextProvider from './contexts/providerRoles/provider-role-string-map-context-provider';
import { convertListToStringMap } from '../contexts/string-map-context/convert-list-to-string-map';
import { IdStringFromNumberAccessor } from '../premises/classroom-suitability/rating-table-accessor-functions';
import { ProviderRoleColorCodingContextProvider } from './provider-role-color-coding-context-provider';
import { getAll } from '../api/READ-ONLY-generated-actions/CycleSubspan';
import { getOne } from '../api/READ-ONLY-generated-actions/Cycle';
import { isNotUndefined } from '../api/main';
import { getDtoListByExampleList } from '../api/READ-ONLY-generated-actions/ProviderRoleAvailability';
import { ProviderRoleAvailabilityDto } from '../api/dtos/ProviderRoleAvailabilityDtoSchema';

export default async function StaffroomLayout({
  children
}: {
  children: ReactNode;
}) {
  const teacherList: ProviderRoleDto[] = [];
  await getTeachersV2().then((r) => {
    if (Array.isArray(r)) {
      for (const teacherDto of r) {
        teacherList.push(teacherDto);
      }
    }
  });

  let availabilityUnits: CycleSubspanDto[] = [];
  let cycleModel: CycleDto = CycleModelMock;
  const { data } = await getAll();
  const { data: cycleOptional } = await getOne(1);
  if (isNotUndefined(data) && isNotUndefined(cycleOptional)) {
    availabilityUnits = data.filter(
      (cycleSubspanDto) => cycleSubspanDto.parentCycleId === 1
    );
    cycleModel = cycleOptional;
  }

  const availabilityMap = new Map<number, ProviderRoleAvailabilityDto[]>();
  for (let providerRoleDto of teacherList) {
    const { data } = await getDtoListByExampleList([
      { providerRoleId: providerRoleDto.id }
    ]);
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
