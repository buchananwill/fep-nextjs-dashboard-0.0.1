'use client';
import React, {
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { HourTransformer } from '../blocks/hour-block';
import { addHours, addMinutes } from 'date-fns';
import { interval } from 'date-fns/interval';
import { TimeDropZone } from '../blocks/time-drop-zone';
import { ZoomScaleContext } from '../../zoom/zoom-scale-context';
import { NormalizedInterval } from 'date-fns/types';
import { useDroppable } from '@dnd-kit/core';
import { PROJECT_EPOCH_DATE_TIME_MONDAY } from '../../../../api/date-and-time';
import { scaleToCalendarZoomX, scaleToCalendarZoomY } from '../calendar-view';

const FALLBACK_DATE = PROJECT_EPOCH_DATE_TIME_MONDAY;

export function useCalendarScaledZoom() {
  const { y: normalizedY, x: normalizedX } = useContext(ZoomScaleContext);
  const y = scaleToCalendarZoomY(normalizedY);
  const x = scaleToCalendarZoomX(normalizedX);
  return { x, y };
}

export default function TimeColumn({
  hours,
  width,
  hourTransFormer: HourTransformerComponent,
  children,
  date,
  ownerId
}: {
  hours: number;
  width: number;
  hourTransFormer?: HourTransformer;
  children?: ReactNode;
  date?: Date;
  ownerId?: number;
}) {
  const [intervals, setIntervals] = useState<NormalizedInterval[]>([]);
  const { y } = useCalendarScaledZoom();

  const zoneRef = useRef('');

  useEffect(() => {
    zoneRef.current = `${ownerId}#${date}`;
  }, [ownerId, date]);

  const { isOver, setNodeRef } = useDroppable({ id: zoneRef.current });

  useEffect(() => {
    const definedDate = date ? date : FALLBACK_DATE;
    const definedIntervals: NormalizedInterval[] = [];
    for (let i = 0; i < hours; i++) {
      const start = addHours(definedDate, i);
      const middle = addMinutes(start, 30);
      const end = addMinutes(middle, 30);

      definedIntervals.push(interval(start, middle));
      definedIntervals.push(interval(middle, end));
    }
    setIntervals(definedIntervals);
  }, [date, hours]);

  return (
    <div
      className={`h-fit relative overflow-visible ${
        isOver ? 'bg-sky-50' : 'odd:bg-gray-50 bg-white'
      }`}
      style={{ width: width }}
      ref={setNodeRef}
    >
      {children}
      {/*{hourBlocks.map((hour) => (*/}
      {/*  <HourBlock*/}
      {/*    width={width}*/}
      {/*    key={`hour-${hour}`}*/}
      {/*    hour={hour}*/}
      {/*    hourTransFormer={HourTransformerComponent}*/}
      {/*  ></HourBlock>*/}
      {/*))}*/}
      {intervals.map((interval, index) => (
        <TimeDropZone
          key={interval.start.getTime()}
          zoneHeight={y / 2}
          zoneWidth={width}
          start={interval.start.getTime()}
          end={interval.end.getTime()}
        >
          {index % 2 == 0 && HourTransformerComponent ? (
            <HourTransformerComponent
              hour={interval.start.getHours()}
            ></HourTransformerComponent>
          ) : (
            ''
          )}
        </TimeDropZone>
      ))}
    </div>
  );
}
