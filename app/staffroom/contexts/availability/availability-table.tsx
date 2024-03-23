'use client';
import React, { useContext, useEffect, useState } from 'react';
import { StaffroomCalenderView } from '../../staffroom-calender-view';

import { enableMapSet } from 'immer';
import {
  AvailabilityContext,
  AvailabilityDispatchContext
} from './availability-context';

import { Transition } from '@headlessui/react';
import { DndContextProvider } from '../../../components/dnd-context-provider';
import { DragEndEvent } from '@dnd-kit/core';

import { ProviderRoleSelectionContext } from '../providerRoles/provider-role-selection-context';

import { getStartAndEndDatesAsEpochal } from './get-start-and-end-dates-as-epochal';
import { createRangeStartingEpochalTime } from '../../../components/calendar-view/range/create-range-starting-monday-this-week';
import { Calendarable } from '../../../components/calendar-view/blocks/timespan-block';
import AvailabilityBlock from '../../../components/calendar-view/blocks/availability-block';
import CalendarRangeContextProvider from '../../../components/calendar-view/range/calendar-range-context-provider';

export function AvailabilityTable() {
  enableMapSet();

  const { providerAvailability, dndMap, cycleModel } =
    useContext(AvailabilityContext);
  const normalizedInterval = createRangeStartingEpochalTime(
    cycleModel.cycleLengthInDays,
    cycleModel.cycleDayZero
  );
  // Get the selected providerRoles and add their availability
  const { selectedProviders } = useContext(ProviderRoleSelectionContext);
  const { dispatch } = useContext(AvailabilityDispatchContext);
  const [eventBlocks, setEventBlocks] = useState(
    new Map<number, Calendarable[]>()
  );

  useEffect(() => {
    const nextBlocks = new Map<number, Calendarable[]>();
    selectedProviders.forEach((providerRole) => {
      const list: Calendarable[] =
        providerAvailability
          .get(providerRole.id)
          ?.map((providerAvailability) => {
            const { startDate, endDate } =
              getStartAndEndDatesAsEpochal(providerAvailability);
            return {
              key: `availability-unit-${providerAvailability.cycleSubspanDto.id}-${providerRole}`,
              startDate: startDate.getTime(),
              endDate: endDate.getTime(),
              colorKey: providerRole.name,
              content: (
                <AvailabilityBlock
                  providerAvailability={providerAvailability}
                />
              )
            };
          }) || [];
      nextBlocks.set(providerRole.id, list);
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
              Loading teacher data.
            </div>
          </Transition>
        }
        {selectedProviders.length == 0 && (
          <div
            className={
              'w-full h-full bg-gray-500/50 absolute top-0 left-0 z-40 flex items-center justify-center rounded-lg'
            }
          >
            No teachers selected.
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
      const { startDate } = getStartAndEndDatesAsEpochal(dataActive);
      const { endDate } = getStartAndEndDatesAsEpochal(dataOver);

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
