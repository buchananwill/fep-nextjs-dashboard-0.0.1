import TimeColumn from './calendar-view/columns/time-column';
import HourLabel from './hour-label';
import React from 'react';

export function HourLabelsColumn() {
  return (
    <div className="sticky left-0 z-20 p-0 m-0 border-0">
      <TimeColumn
        hours={24}
        width={50}
        hourTransFormer={HourLabel}
      ></TimeColumn>
    </div>
  );
}