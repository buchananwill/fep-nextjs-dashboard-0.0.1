import React, { ReactNode } from 'react';

import { ProviderRoleAndTaskData } from './contexts/providerRoles/provider-context';
import ProviderRoleContextProvider from './contexts/providerRoles/provider-role-context-provider';
import AvailabilityContextProvider from './contexts/availability/availability-context-provider';
import { TeachersToolCard } from './teachers-tool-card';
import ToolCardContextProvider from '../components/tool-card/tool-card-context-provider';
import { ProviderRoleDto } from '../api/dtos/ProviderRoleDtoSchema';
import { performApiAction } from '../api/actions/performApiAction';
import { getTeachers } from '../api/actions/provider-roles';
import { EventDto } from '../api/dtos/EventDtoSchema';
import { WorkTaskTypeDto } from '../api/dtos/WorkTaskTypeDtoSchema';
import { getWorkTaskTypes } from '../api/actions/work-task-types';
import { SECONDARY_EDUCATION_CATEGORY_ID } from '../api/main';
import { CycleSubspanDto } from '../api/dtos/CycleSubspanDtoSchema';
import { getAvailabilities } from '../api/actions/availability';
import { ProviderAvailabilityDto } from '../api/dtos/ProviderAvailabilityDtoSchema';
import { getCycleModel } from '../api/actions/cycle-model';

import { CycleDto } from '../api/dtos/CycleDtoSchema';
import { CycleModelMock } from './contexts/availability/availability-context';
import CalendarRangeContextProvider from '../components/calendar-view/range/calendar-range-context-provider';

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

  const eventMap = new Map<number, EventDto[]>();
  const eventsById: { [key: string]: EventDto } = {};

  let veryFirstEvent: EventDto | undefined;

  // for (let { partyId, id } of teacherList) {
  //   await performApiAction(() => getCalendarEvents(partyId)).then((r) => {
  //     if (r.data) {
  //       eventMap.set(id, r.data);
  //       r.data?.forEach((event) => (eventsById[event.id] = event));
  //       const firstEvent = r.data[0];
  //       veryFirstEvent =
  //         !veryFirstEvent ||
  //         firstEvent?.eventStart.getTime() < veryFirstEvent.eventStart.getTime()
  //           ? firstEvent
  //           : veryFirstEvent;
  //     }
  //   });
  // }

  let workTaskTypeDtos: WorkTaskTypeDto[] = [];

  const { data: workTaskTypeDtosOptional } = await getWorkTaskTypes(
    SECONDARY_EDUCATION_CATEGORY_ID
  );

  if (workTaskTypeDtosOptional) {
    workTaskTypeDtos = workTaskTypeDtosOptional;
  }

  const providerRolesAndTaskData: ProviderRoleAndTaskData = {
    providerRoles: teacherList,
    workTaskTypes: workTaskTypeDtos
  };
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
      <ProviderRoleContextProvider
        providerRoleAndTaskData={providerRolesAndTaskData}
      >
        <CalendarRangeContextProvider>
          {/*  <EventsContextProvider*/}
          {/*    initialContext={{*/}
          {/*      events: eventMap,*/}
          {/*      eventsById: eventsById,*/}
          {/*      unSyncedEvents: []*/}
          {/*    }}*/}
          {/*  >*/}
          <div className="flex w-full px-2">
            <ToolCardContextProvider>
              <TeachersToolCard />
            </ToolCardContextProvider>
            {children}
          </div>
          {/*</EventsContextProvider>*/}
        </CalendarRangeContextProvider>
      </ProviderRoleContextProvider>
    </AvailabilityContextProvider>
  );
}
