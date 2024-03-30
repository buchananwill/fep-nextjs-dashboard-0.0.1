'use client';
import { useSelectiveContextControllerBoolean } from './selective-context-manager-boolean';
import React from 'react';
import { Switch } from '@tremor/react';

export function SelectiveContextDispatcherBoolean({
  uniqueKey,
  initialValue = true,
  listenerKey
}: {
  uniqueKey: string;
  initialValue: boolean;
  listenerKey: string;
}) {
  const { currentState, dispatchUpdate } = useSelectiveContextControllerBoolean(
    uniqueKey,
    listenerKey,
    initialValue
  );

  return (
    <Switch
      id={uniqueKey}
      color={'emerald'}
      onChange={() => {
        dispatchUpdate({ contextKey: uniqueKey, value: !currentState });
      }}
      // className={` ${
      //   currentState
      //     ? 'bg-emerald-600 hover:bg-emerald-300'
      //     : 'bg-red-300 hover:bg-red-300'
      // } `}
      checked={currentState}
    ></Switch>
  );
}
