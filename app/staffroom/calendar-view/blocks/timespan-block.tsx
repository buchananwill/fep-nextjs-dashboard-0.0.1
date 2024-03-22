'use client';
import React, { ReactNode, useContext, useMemo, useState } from 'react';

import { ColorCoding } from '../../../contexts/color-coding/context';
import { ZoomScaleContext } from '../scale/zoom-scale-context';

import { NormalizedInterval } from 'date-fns/types';

import { HasNumberId } from '../../../api/zod-mods';
import DepthContextProvider from '../../../contexts/z-context/z-context-provider';
import { Z_INDEX } from '../../../contexts/z-context/z-context';

export function TimespanBlock({
  interval: { end, start },
  children
}: {
  interval: NormalizedInterval;
  children: ReactNode;
}) {
  const { x, y } = useContext(ZoomScaleContext);
  const [zIndex, setZIndex] = useState<Z_INDEX>('z-10');
  const MINUTES_IN_DAY = y * 24;

  const depthContextMemo = useMemo(
    () => ({ zIndex, setZIndex }),
    [zIndex, setZIndex]
  );

  function eventPositionTop(startDateTime: Date, endDateTime: Date) {
    return startDateTime.getHours() * y + startDateTime.getMinutes() * (y / 60);
  }

  function eventPositionBottom(startDateTime: Date, endDateTime: Date) {
    let start = eventPositionTop(startDateTime, endDateTime);
    let end =
      MINUTES_IN_DAY -
      (endDateTime.getHours() * y + endDateTime.getMinutes() * (y / 60));

    return end + start < MINUTES_IN_DAY ? end : 0;
  }

  return (
    <div
      className={` p-0 m-0 absolute select-none ${zIndex} overflow-visible`}
      style={{
        width: `${x - 4}px`,
        inset: `${eventPositionTop(start, end)}px 2px ${eventPositionBottom(
          start,
          end
        )}px 2px`
      }}
    >
      <DepthContextProvider initial={depthContextMemo}>
        {children}
      </DepthContextProvider>
    </div>
  );
}

export function getFormattedTimeHHMM(date: Date) {
  const hours = formatAsTwoDigits(date.getHours());
  const minutes = formatAsTwoDigits(date.getMinutes());
  return `${hours}:${minutes}`;
}

export function formatAsTwoDigits(number: number): string {
  if (number >= 0 && number < 10) return '0' + number.toString();
  if (number < 0 && number > -10) return '-0' + number.toString();
  if (number > 99 || number < -99) throw new Error('Arguments exceeds range.');
  else return number.toString();
}

export interface Calendarable {
  key: string;
  interval: NormalizedInterval;
  colorKey: string;
  content: React.JSX.Element;
}

export function generateTimespanBlock({ interval, content }: Calendarable) {
  return <TimespanBlock interval={interval}>{content}</TimespanBlock>;
}
