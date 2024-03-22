'use client';
import { createDateMatcher, getDayOfWeekAbr } from '../../classes/local-date';
import { MONTHS } from './range/calendar-range-reducers';
import { DaySubColumnLabel } from './day-sub-column-label';
import { HourLabelsColumn } from '../hour-labels-column';
import React, { ReactNode, useContext, useEffect, useRef } from 'react';
import { ZoomScaleContext } from './scale/zoom-scale-context';
import { NameIdNumberTuple } from '../../api/zod-mods';
import { DndContext } from '@dnd-kit/core';

export function makeMondayZero(day: number) {
  return (day + 6) % 7;
}

export default function CalendarView({
  dates,
  totalDayWidth,
  daySubLabels,
  children
}: {
  totalDayWidth: number;
  dates: Date[];
  daySubLabels: NameIdNumberTuple[];
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      const elHeight = ref.current.offsetHeight / 2;
      ref.current.scrollTop = ref.current.scrollHeight / 2 - elHeight;
    }
  }, [ref]);

  const todayMatcher = createDateMatcher(new Date(Date.now()));
  return (
    <div style={{ maxHeight: '600px', height: `100%` }}>
      <div
        className="border-2 overflow-auto rounded-md"
        ref={ref}
        style={{
          height: `100%`,
          maxHeight: '100%'
        }}
      >
        <div className="flex sticky top-0 z-30 bg-white border w-fit">
          <div className="w-[50px] border-0 p-0 m-0"></div>
          {dates.map((day, index) => (
            <div key={index}>
              <div
                className={`flex text-center justify-center  overflow-hidden px-2 ${
                  day.getDay() == 1 && 'font-medium'
                } border border-dark-tremor-border ${
                  todayMatcher(day) && 'bg-blue-100'
                }`}
                style={{
                  height: `30px`,
                  width: `${totalDayWidth}px`
                }}
              >
                {getDayOfWeekAbr(makeMondayZero(day.getDay()))}, {day.getDate()}{' '}
                {MONTHS[day.getMonth()]}
              </div>
              <div className="flex">
                {daySubLabels.map(({ id, name }) => (
                  <DaySubColumnLabel key={id} labelText={name} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit w-fit relative flex row ">
          <HourLabelsColumn />
          {children}
        </div>
      </div>
    </div>
  );
}
