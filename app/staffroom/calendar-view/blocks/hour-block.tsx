'use client';
import React, { useContext, useMemo } from 'react';
import { ZoomScaleContext } from '../scale/zoom-scale-context';
import { CalendarIdContext } from './calendar-id-context';
import { DateColumnContext } from '../columns/date-column-context';
import { useDroppable } from '@dnd-kit/core';
import { TimeDropZone } from './time-drop-zone';
import { set } from 'date-fns';
import { interval } from 'date-fns/interval';

export interface HourTransformerProps {
  hour: number;
}

export type HourTransformer = React.FC<HourTransformerProps>;

function normalizeHourBlock(date: Date, hour: number) {
  const first = set(date, {
    hours: hour,
    minutes: 0,
    seconds: 0,
    milliseconds: 0
  });
  const middle = set(date, {
    hours: hour,
    minutes: 30,
    seconds: 0,
    milliseconds: 0
  });
  const last = set(date, {
    hours: hour + 1,
    minutes: 0,
    seconds: 0,
    milliseconds: 0
  });
  return [first, middle, last];
}

export function HourBlock({
  width,
  hour,
  children,
  hourTransFormer: HourTransformerComponent
}: {
  width: number;
  children?: React.ReactNode;
  hourTransFormer?: HourTransformer;
  hour: number;
}) {
  const { y } = useContext(ZoomScaleContext);

  const date = useContext(DateColumnContext);

  const [first, middle, last] = useMemo(
    () => normalizeHourBlock(date, hour),
    [date, hour]
  );

  const firstInterval = useMemo(() => interval(first, middle), [first, middle]);
  const secondInterval = useMemo(() => interval(middle, last), [last, middle]);

  const zoneHeight = y / 2;
  return (
    <div>
      {children && children}
      <TimeDropZone
        zoneHeight={zoneHeight}
        zoneWidth={width}
        start={firstInterval.start.getTime()}
        end={firstInterval.end.getTime()}
      >
        {HourTransformerComponent && (
          <HourTransformerComponent hour={hour}></HourTransformerComponent>
        )}
      </TimeDropZone>
      <TimeDropZone
        zoneHeight={zoneHeight}
        zoneWidth={width}
        start={secondInterval.start.getTime()}
        end={secondInterval.end.getTime()}
      ></TimeDropZone>
    </div>
  );
}
