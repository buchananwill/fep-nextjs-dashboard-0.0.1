'use client';

import {
  CalendarRangeContext,
  CalendarRangeDispatch
} from './calendar-range-context';
import { ReactNode, useReducer, useState } from 'react';
import calendarRangeReducers from './calendar-range-reducers';
import { NormalizedInterval } from 'date-fns/types';
import ZoomScaleContextProvider from '../scale/zoom-scale-context-provider';

import { addDays } from 'date-fns/fp';
import { interval } from 'date-fns/interval';

export function createRangeStartingMondayThisWeek() {
  const startDateTime = new Date(Date.now());

  let localDate = createLocalDate(startDateTime);

  let firstDayInWeek = addDays(-localDate.dayOfWeek.valueOf())(startDateTime);

  const addSixDays = addDays(6);

  let lastDayInWeek = addSixDays(firstDayInWeek);

  return interval(firstDayInWeek, lastDayInWeek);
}

export default function CalendarRangeContextProvider({
  initialRange: initialRangeProp,
  dayWidth,
  hours,
  hourHeight,
  children
}: {
  initialRange?: NormalizedInterval;
  dayWidth?: number;
  hours?: number;
  hourHeight?: number;
  children: ReactNode;
}) {
  let initialRange = initialRangeProp;

  if (!initialRange) {
    initialRange = createRangeStartingMondayThisWeek();
  }

  const [calendarRangeState, dispatch] = useReducer(
    calendarRangeReducers,
    initialRange
  );
  return (
    <CalendarRangeContext.Provider value={calendarRangeState}>
      <CalendarRangeDispatch.Provider value={dispatch}>
        <ZoomScaleContextProvider xScale={dayWidth} yScale={hourHeight}>
          {children}
        </ZoomScaleContextProvider>
      </CalendarRangeDispatch.Provider>
    </CalendarRangeContext.Provider>
  );
}
