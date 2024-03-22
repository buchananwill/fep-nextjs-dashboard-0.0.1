'use client';
import React, { useContext, useEffect, useState } from 'react';
import { StaffroomCalenderView } from '../../staffroom-calender-view';

import { enableMapSet } from 'immer';
import {
  AvailabilityContext,
  AvailabilityDispatchContext
} from './availability-context';
import AvailabilityBlock from '../../calendar-view/blocks/availability-block';
import { Calendarable } from '../../calendar-view/blocks/timespan-block';

import CalendarRangeContextProvider from '../../calendar-view/range/calendar-range-context-provider';

import { Transition } from '@headlessui/react';
import { DndContextProvider } from '../../../components/dnd-context-provider';
import { DragEndEvent } from '@dnd-kit/core';

import { ProviderRoleSelectionContext } from '../providerRoles/provider-role-selection-context';
import {
  createRangeStartingMondayEpochalTime,
  createRangeStartingMondayThisWeek
} from '../../calendar-view/range/create-range-starting-monday-this-week';
import { getStartAndEndDatesAsEpochal } from './get-start-and-end-dates-as-epochal';

export function AvailabilityTable() {
  enableMapSet();

  const normalizedInterval = createRangeStartingMondayEpochalTime();
  // Get the selected providerRoles and add their availability
  const { selectedProviders } = useContext(ProviderRoleSelectionContext);
  const { providerAvailability, dndMap } = useContext(AvailabilityContext);
  const { dispatch } = useContext(AvailabilityDispatchContext);
  const [eventBlocks, setEventBlocks] = useState(
    new Map<number, Calendarable[]>()
  );

  useEffect(() => {
    const nextBlocks = new Map<number, Calendarable[]>();
    selectedProviders.forEach((mechanic) => {
      const list: Calendarable[] =
        providerAvailability.get(mechanic.id)?.map((providerAvailability) => {
          const { startDate, endDate } =
            getStartAndEndDatesAsEpochal(providerAvailability);
          return {
            key: `availability-unit-${providerAvailability.cycleSubspanDto.id}-${mechanic}`,
            startDate: startDate.getTime(),
            endDate: endDate.getTime(),
            colorKey: mechanic.name,
            content: (
              <AvailabilityBlock providerAvailability={providerAvailability} />
            )
          };
        }) || [];
      nextBlocks.set(mechanic.id, list);
    });

    setEventBlocks(nextBlocks);
  }, [providerAvailability, selectedProviders]);

  return (
    <DndContextProvider onDragEnd={handleDragEnd}>
      <CalendarRangeContextProvider initialRange={normalizedInterval}>
        {
          <Transition
            show={false}
            enter="transition-opacity duration-75"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className={
                'w-full top-0 left-0 h-full bg-gray-100 bg-opacity-75 z-40 absolute rounded-lg flex items-center justify-center'
              }
            >
              Loading mechanic data.
            </div>
          </Transition>
        }
        {selectedProviders.length == 0 && (
          <div
            className={
              'w-full h-full bg-gray-500/50 absolute top-0 left-0 z-40 flex items-center justify-center rounded-lg'
            }
          >
            No mechanics selected.
          </div>
        )}
        <StaffroomCalenderView
          eventBlocks={eventBlocks}
        ></StaffroomCalenderView>
      </CalendarRangeContextProvider>
    </DndContextProvider>
  );
  function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event;
    if (over) {
      const dataOver = dndMap[over.id];
      const dataActive = dndMap[active.id];
      const { startDate, endDate } = getStartAndEndDatesAsEpochal(dataActive);

      dispatch({
        type: 'toggleAvailability',
        start: startDate.getTime(),
        end: endDate.getTime(),
        targetOutcome: dataActive.availabilityCode,
        providerId: dataActive.providerRoleId
      });
    }
  }
}
