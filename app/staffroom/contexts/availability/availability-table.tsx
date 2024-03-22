'use client';
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useTransition
} from 'react';
import { StaffroomCalenderView } from '../../staffroom-calender-view';
import {
  ProviderAvailability,
  ProviderAvailabilityDto
} from '../../../api/dto-interfaces';
import { ProviderContext } from '../mechanics/provider-context';
import { enableMapSet, produce } from 'immer';
import {
  AvailabilityContext,
  AvailabilityDispatchContext
} from './availability-context';
import AvailabilityBlock from '../../calendar-view/blocks/availability-block';
import { Calendarable } from '../../calendar-view/blocks/timespan-block';
import { CalendarRangeContext } from '../../calendar-view/range/calendar-range-context';
import CalendarRangeContextProvider, {
  createRangeStartingMondayThisWeek
} from '../../calendar-view/range/calendar-range-context-provider';
import { map } from 'd3-array';
import { Text } from '@tremor/react';
import { PageTitleContext } from '../../../contexts/page-title/page-title-context';
import { Transition } from '@headlessui/react';
import { DndContextProvider } from '../../../components/dnd-context-provider';
import { DataRef, DragEndEvent } from '@dnd-kit/core';

import { getAvailabilities } from '../../../actions/availability';
import { TeacherSelectionContext } from '../mechanics/teacher-selection-context';

export function AvailabilityTable() {
  enableMapSet();

  const normalizedInterval = createRangeStartingMondayThisWeek();
  // Get the selected mechanics and add their availability
  const { selectedProviders } = useContext(TeacherSelectionContext);
  const { mechanicAvailability, dndMap } = useContext(AvailabilityContext);
  const { dispatch } = useContext(AvailabilityDispatchContext);
  const [eventBlocks, setEventBlocks] = useState(
    new Map<number, Calendarable[]>()
  );

  const { setTitle } = useContext(PageTitleContext);
  useEffect(() => {
    setTitle('Weekly Availability');
  }, [setTitle]);

  useEffect(() => {
    const nextBlocks = new Map<number, Calendarable[]>();
    selectedProviders.forEach((mechanic) => {
      const list: Calendarable[] =
        mechanicAvailability.get(mechanic.id)?.map((providerAvailability) => ({
          key: `availability-unit-${providerAvailability.cycleSubspan.id}-${mechanic}`,
          interval: providerAvailability.cycleSubspan.timespan,
          colorKey: mechanic.name,
          content: (
            <AvailabilityBlock providerAvailability={providerAvailability} />
          )
        })) || [];
      nextBlocks.set(mechanic.id, list);
    });

    setEventBlocks(nextBlocks);
  }, [mechanicAvailability, selectedProviders]);

  return (
    <DndContextProvider onDragEnd={handleDragEnd}>
      <CalendarRangeContextProvider
        initialRange={normalizedInterval}
        dayWidth={60}
      >
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

      dispatch({
        type: 'toggleAvailability',
        start: dataActive.cycleSubspan.timespan.start,
        end: dataOver.cycleSubspan.timespan.end,
        targetOutcome: dataActive.availabilityCode,
        mechanic: dataActive.providerId
      });
    }
  }
}
