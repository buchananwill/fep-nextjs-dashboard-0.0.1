'use client';
import { PropsWithChildren, useEffect, useState } from 'react';
import {
  ContextRefNumber,
  DispatchUpdateContextNumber,
  UpdateRefContextNumber,
  useSelectiveContextDispatch,
  useSelectiveContextListener
} from './selective-context-creator';
import {
  ContextRef,
  useSelectiveContextManager
} from './selective-context-manager';
import {
  useSelectiveContextDispatchBoolean,
  useSelectiveContextListenerBoolean
} from './selective-context-manager-boolean';

export default function SelectiveContextManagerNumber({
  children
}: PropsWithChildren) {
  const { dispatch, triggerUpdateRef, contextRef } = useSelectiveContextManager(
    {} as ContextRef<number>
  );

  return (
    <DispatchUpdateContextNumber.Provider value={dispatch}>
      <UpdateRefContextNumber.Provider value={triggerUpdateRef}>
        <ContextRefNumber.Provider value={contextRef}>
          {children}
        </ContextRefNumber.Provider>
      </UpdateRefContextNumber.Provider>
    </DispatchUpdateContextNumber.Provider>
  );
}

export function useSelectiveContextDispatchNumber(
  contextKey: string,
  initialValue: number,
  listenerKey?: string
) {
  const { currentState, dispatchUpdate } = useSelectiveContextDispatch(
    contextKey,
    initialValue,
    UpdateRefContextNumber,
    DispatchUpdateContextNumber,
    ContextRefNumber,
    listenerKey || contextKey
  );

  return { currentState, dispatchUpdate };
}

export function useSelectiveContextListenerNumber(
  contextKey: string,
  listenerKey: string
) {
  const { currentState, latestRef } = useSelectiveContextListener(
    contextKey,
    listenerKey,
    UpdateRefContextNumber,
    ContextRefNumber,
    1 as number
  );

  return { currentState };
}
