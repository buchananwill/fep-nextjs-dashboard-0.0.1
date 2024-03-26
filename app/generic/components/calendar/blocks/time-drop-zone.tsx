import React, { useContext, useMemo } from 'react';

import { CalendarIdContext } from './calendar-id-context';

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
  useMemo(() => {
    return `${calendarId}#${start}:${end}`;
  }, [calendarId, start, end]);
  return (
    <div
      className={`border-0 border-t border-gray-300 even:border-dashed relative`}
      style={{ height: `${zoneHeight}px`, width: `${zoneWidth}px` }}
    >
      {children}
    </div>
  );
}
