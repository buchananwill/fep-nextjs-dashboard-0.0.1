import React, { useContext, useEffect, useMemo } from 'react';

import { useDroppable } from '@dnd-kit/core';
import { CalendarIdContext } from './calendar-id-context';
import { EventsDispatch } from '../../contexts/events/event-context';

export function TimeDropZone({
  children,
  zoneHeight,
  zoneWidth,
  start,
  end
}: {
  start: number;
  end: number;
  zoneHeight: number;
  zoneWidth: number;
  children?: React.ReactNode;
}) {
  const calendarId = useContext(CalendarIdContext);
  const memoKey = useMemo(() => {
    return `${calendarId}#${start}:${end}`;
  }, [calendarId, start, end]);

  // const { isOver, setNodeRef, active } = useDroppable({ id: memoKey });

  return (
    <div
      className={`border-0 border-t border-gray-300 even:border-dashed relative ${
        false
          ? 'bg-emerald-300 animate-pulse outline-2 outline outline-gray-500 rounded-lg outline-offset-2 z-10'
          : ''
      }`}
      style={{ height: `${zoneHeight}px`, width: `${zoneWidth}px` }}
    >
      {children}
    </div>
  );
}
