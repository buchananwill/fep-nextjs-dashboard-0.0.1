'use client';
import React from 'react';
import { useSelectiveContextControllerNumber } from '../../../selective-context/components/typed/selective-context-manager-number';
import { Slider } from '@nextui-org/slider';

export function SelectiveContextRangeSlider({
  contextKey,
  initialValue,
  listenerKey,
  maxValue = 200,
  minValue = 0,
  className = ''
}: {
  contextKey: string;
  initialValue: number;
  listenerKey: string;
  maxValue?: number;
  minValue?: number;
  className?: string;
}) {
  const { currentState, dispatchUpdate } = useSelectiveContextControllerNumber({
    contextKey,
    listenerKey,
    initialValue
  });

  return (
    <Slider
      className={className}
      hideValue={false}
      showTooltip={true}
      hideThumb
      size={'md'}
      name={contextKey}
      id={contextKey}
      minValue={minValue}
      maxValue={maxValue}
      value={currentState}
      aria-label={contextKey}
      onChange={(value) => {
        const singleValue = Array.isArray(value) ? value[0] : value;

        dispatchUpdate({
          contextKey: contextKey,
          update: singleValue
        });
      }}
    ></Slider>
  );
}
