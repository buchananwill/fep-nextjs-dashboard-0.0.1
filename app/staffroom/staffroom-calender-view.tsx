'use client';
import React, { useContext } from 'react';
import { CalendarRangeContext } from './calendar-view/range/calendar-range-context';
import DayColumn from './calendar-view/columns/day-column';
import { eachDayOfInterval } from 'date-fns';
import { ProviderContext } from './contexts/providerRoles/provider-context';
import { ZoomScaleContext } from './calendar-view/scale/zoom-scale-context';

import CalendarView, {
  scaleToCalendarZoomX
} from './calendar-view/calendar-view';
import { Calendarable } from './calendar-view/blocks/timespan-block';
import { ProviderRoleSelectionContext } from './contexts/providerRoles/provider-role-selection-context';
import { useCalendarScaledZoom } from './calendar-view/columns/time-column';

export function StaffroomCalenderView({
  eventBlocks
}: {
  eventBlocks: Map<number, Calendarable[]>;
}) {
  const interval = useContext(CalendarRangeContext);
  let dates = eachDayOfInterval(interval);

  const { x } = useCalendarScaledZoom();
  const { selectedProviders } = useContext(ProviderRoleSelectionContext);
  const totalDayWidth =
    selectedProviders.length > 0 ? selectedProviders.length * x : x;

  const providerNames = selectedProviders;
  const numbers = selectedProviders.map(({ id }) => id);
  return (
    <CalendarView
      totalDayWidth={totalDayWidth}
      dates={dates}
      daySubLabels={providerNames}
    >
      {dates.map((day, index) => (
        <DayColumn
          key={`${index}`}
          date={day}
          selectedCalendars={numbers}
          calendarables={eventBlocks}
        ></DayColumn>
      ))}

      {/* A day column is just a bunch of TimeColumns side by side.
          The time columns are always in the same order, so they match the calendar labels.
          The time columns have as children: some elements that are enclosed in TimespanBlocks.*/}
    </CalendarView>
  );
}