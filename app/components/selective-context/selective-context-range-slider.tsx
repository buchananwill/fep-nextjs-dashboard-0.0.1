'use client';
import React from 'react';
import { useSelectiveContextDispatchNumber } from './selective-context-manager-number';

export function SelectiveContextRangeSlider({
  uniqueKey,
  initialValue = 100,
  listenerKey,
  maxValue = 200,
  minValue = 0
}: {
  uniqueKey: string;
  initialValue?: number;
  maxValue?: number;
  minValue?: number;
  listenerKey?: string;
}) {
  const { currentState, dispatchUpdate } = useSelectiveContextDispatchNumber(
    uniqueKey,
    initialValue,
    listenerKey
  );

  return (
    <input
      name={uniqueKey}
      id={uniqueKey}
      type={'range'}
      min={minValue}
      max={maxValue}
      value={currentState}
      onChange={(event) => {
        dispatchUpdate({
          contextKey: uniqueKey,
          value: parseInt(event.target.value)
        });
      }}
    ></input>
  );
}
