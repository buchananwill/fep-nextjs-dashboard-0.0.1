'use client';
import TimeColumn, { useCalendarScaledZoom } from './time-column';
import React, { useContext } from 'react';
import { CurryPredicate, Predicate } from '../../filters/filter-types';
import { Calendarable, TimespanBlock } from '../blocks/timespan-block';

import DateColumnContextProvider from './date-column-context-provider';
import CalendarIdContextProvider from '../blocks/calendar-id-context-provider';

export const createDateMatcher: CurryPredicate<Date> = (date: Date) => {
  return (dateToMatch: Date) => {
    if (date.getFullYear() != dateToMatch.getFullYear()) return false;
    if (date.getMonth() != dateToMatch.getMonth()) return false;
    return date.getDate() == dateToMatch.getDate();
  };
};

export default function DayColumn({
  date,
  calendarables,
  selectedCalendars
}: {
  date: Date;
  calendarables: Map<number, Calendarable[]>;
  selectedCalendars: number[];
}) {
  const { x } = useCalendarScaledZoom();
  const matchDate: Predicate<Date> = createDateMatcher(date);
  if (selectedCalendars.length == 0) {
    return <TimeColumn hours={24} width={x} date={date}></TimeColumn>;
  }

  const matchStartOrEnd = ({
    startDate,
    endDate
  }: {
    startDate: number;
    endDate: number;
  }) => {
    return matchDate(new Date(startDate)) || matchDate(new Date(endDate));
  };

  return (
    <DateColumnContextProvider date={date}>
      {selectedCalendars.map((calendarId) => {
        const subList = calendarables.get(calendarId) || [];
        return (
          <CalendarIdContextProvider calendarId={calendarId} key={calendarId}>
            <TimeColumn hours={24} width={x} date={date} ownerId={calendarId}>
              {subList
                .filter(({ startDate, endDate }) =>
                  matchStartOrEnd({ startDate, endDate })
                )
                .map(({ content, key, ...interval }) => (
                  <TimespanBlock key={key} {...interval}>
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
