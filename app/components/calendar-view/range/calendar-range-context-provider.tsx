'use client';

import {
  CalendarRangeContext,
  CalendarRangeDispatch
} from './calendar-range-context';
import { ReactNode, useReducer } from 'react';
import calendarRangeReducers from './calendar-range-reducers';
import { NormalizedInterval } from 'date-fns/types';
import ZoomScaleContextProvider from '../scale/zoom-scale-context-provider';
import { createRangeStartingMondayThisWeek } from './create-range-starting-monday-this-week';

export default function CalendarRangeContextProvider({
  initialRange: initialRangeProp,
  dayWidth,
  hourHeight,
  children
}: {
  initialRange?: NormalizedInterval;
  dayWidth?: number;
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
