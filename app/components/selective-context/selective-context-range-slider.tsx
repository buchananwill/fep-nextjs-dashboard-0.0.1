'use client';
import React from 'react';
import { useSelectiveContextDispatchNumber } from './selective-context-manager-number';

export function SelectiveContextRangeSlider({
  dispatchKey,
  initialValue,
  listenerKey,
  maxValue = 200,
  minValue = 0
}: {
  dispatchKey: string;
  initialValue: number;
  listenerKey: string;
  maxValue?: number;
  minValue?: number;
}) {
  const { currentState, dispatchUpdate } = useSelectiveContextDispatchNumber(
    dispatchKey,
    listenerKey,
    initialValue
  );

  return (
    <input
      name={dispatchKey}
      id={dispatchKey}
      type={'range'}
      min={minValue}
      max={maxValue}
      value={currentState}
      onChange={(event) => {
        dispatchUpdate({
          contextKey: dispatchKey,
          value: parseInt(event.target.value)
        });
      }}
    ></input>
  );
}
