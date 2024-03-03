'use client';
import React from 'react';
import { useSelectiveContextControllerNumber } from './selective-context-manager-number';

export function SelectiveContextRangeSlider({
  contextKey,
  initialValue,
  listenerKey,
  maxValue = 200,
  minValue = 0
}: {
  contextKey: string;
  initialValue: number;
  listenerKey: string;
  maxValue?: number;
  minValue?: number;
}) {
  const { currentState, dispatchUpdate } = useSelectiveContextControllerNumber({
    contextKey,
    listenerKey,
    initialValue
  });

  return (
    <input
      name={contextKey}
      id={contextKey}
      type={'range'}
      min={minValue}
      max={maxValue}
      value={currentState}
      onChange={(event) => {
        dispatchUpdate({
          contextKey: contextKey,
          value: parseInt(event.target.value)
        });
      }}
    ></input>
  );
}
