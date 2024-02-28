'use client';
import { useSelectiveContextDispatchBoolean } from './selective-context-manager-boolean';
import React from 'react';

export function SelectiveContextDispatcherBoolean({
  uniqueKey,
  initialValue = true,
  listenerKey
}: {
  uniqueKey: string;
  initialValue: boolean;
  listenerKey: string;
}) {
  const { currentState, dispatchUpdate } = useSelectiveContextDispatchBoolean(
    uniqueKey,
    listenerKey,
    initialValue
  );

  return (
    <input
      type={'checkbox'}
      id={uniqueKey}
      onChange={() => {
        dispatchUpdate({ contextKey: uniqueKey, value: !currentState });
      }}
      className={`toggle ${
        currentState
          ? 'bg-emerald-600 hover:bg-emerald-300'
          : 'bg-red-300 hover:bg-red-300'
      } `}
      checked={currentState}
    ></input>
  );
}
