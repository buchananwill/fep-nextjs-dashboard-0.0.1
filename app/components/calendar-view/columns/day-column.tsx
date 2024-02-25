'use client';
import TimeColumn from './time-column';
import React, { useContext } from 'react';
import { Predicate } from '../../../components/filters/filter-types';
import { Calendarable, TimespanBlock } from '../blocks/timespan-block';

import { ZoomScaleContext } from '../scale/zoom-scale-context';

import { createDateMatcher } from '../../../classes/local-date';

import { NormalizedInterval } from 'date-fns/types';

import DateColumnContextProvider from './date-column-context-provider';
import CalendarIdContextProvider from '../blocks/calendar-id-context-provider';

export default function DayColumn({
  date,
  calendarables,
  selectedCalendars
}: {
  date: Date;
  calendarables: Map<number, Calendarable[]>;
  selectedCalendars: number[];
}) {
  const { x } = useContext(ZoomScaleContext);
  const matchDate: Predicate<Date> = createDateMatcher(date);
  if (selectedCalendars.length == 0) {
    return <TimeColumn hours={24} width={x} date={date}></TimeColumn>;
  }

  const matchStartOrEnd = ({ start, end }: NormalizedInterval) => {
    return matchDate(start) || matchDate(end);
  };

  return (
    <DateColumnContextProvider date={date}>
      {selectedCalendars.map((calendarId) => {
        const subList = calendarables.get(calendarId) || [];
        return (
          <CalendarIdContextProvider calendarId={calendarId} key={calendarId}>
            <TimeColumn hours={24} width={x} date={date} ownerId={calendarId}>
              {subList
                .filter((calendarable) =>
                  matchStartOrEnd(calendarable.interval)
                )
                .map(({ key, content, interval }) => (
                  <TimespanBlock key={key} interval={interval}>
                    {content}
                  </TimespanBlock>
                ))}
            </TimeColumn>
          </CalendarIdContextProvider>
        );
      })}
    </DateColumnContextProvider>
  );
}
