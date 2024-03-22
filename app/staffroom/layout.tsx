import React, { ReactNode } from 'react';

import { ProviderAndTaskData } from './contexts/mechanics/provider-context';
import ProviderRoleContextProvider from './contexts/mechanics/mechanic-context-provider';
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
import {
  getAvailabilities,
  getAvailbilityUnits
} from '../api/actions/availability';
import { ProviderAvailabilityDto } from '../api/dtos/ProviderAvailabilityDtoSchema';

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

      for (const mechanicDto of teacherDtos) {
        teacherList.push(mechanicDto);
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

  const sptList: WorkTaskTypeDto[] = [];
  performApiAction(() =>
    getWorkTaskTypes(SECONDARY_EDUCATION_CATEGORY_ID)
  ).then((r) => {
    if (r.data) sptList.push(...r.data);
  });

  const mechanicAndTaskData: ProviderAndTaskData = {
    mechanics: teacherList,
    workTaskTypes: sptList
  };
  const availabilityUnits: CycleSubspanDto[] = [];
  performApiAction(() => getAvailbilityUnits()).then((r) => {
    if (r.data) {
      availabilityUnits.push(...r.data);
    }
  });

  const availabilityMap = new Map<number, ProviderAvailabilityDto[]>();
  for (let mechanicDto of teacherList) {
    performApiAction(() => getAvailabilities(mechanicDto.id)).then((r) => {
      if (r.data) availabilityMap.set(mechanicDto.id, r.data);
    });
  }

  return (
    <AvailabilityContextProvider
      initialData={{
        workshopAvailability: availabilityUnits,
        mechanicAvailability: availabilityMap,
        unsavedChanges: false,
        dndMap: {}
      }}
    >
      <ProviderRoleContextProvider mechanicAndTaskData={mechanicAndTaskData}>
        {/*<CalendarRangeContextProvider>*/}
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
        {/*</CalendarRangeContextProvider>*/}
      </ProviderRoleContextProvider>
    </AvailabilityContextProvider>
  );
}
