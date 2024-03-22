import { HourTransformerProps } from './calendar-view/blocks/hour-block';
import React from 'react';

export default function HourLabel({ hour }: HourTransformerProps) {
  return (
    <div
      className="absolute top-1 right-1 flex justify-end"
      style={{ width: '50px' }}
    >
      <span className="text-base p-0 m-0 leading-4 ">
        {hour < 10 ? '0' + hour : hour.toString()}
      </span>
      <span className="align-text-bottom text-xs pl-0.5 text-gray-400 ">
        00
      </span>
    </div>
  );
}
