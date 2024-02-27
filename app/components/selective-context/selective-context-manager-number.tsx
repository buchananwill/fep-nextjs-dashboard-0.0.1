'use client';
import { PropsWithChildren, useEffect, useState } from 'react';
import {
  ContextRefNumber,
  DispatchUpdateContextNumber,
  UpdateRefContextNumber
} from './selective-context-creator';
import {
  LatestValueRef,
  useSelectiveContextManager
} from './selective-context-manager';
import { useSelectiveContextDispatch } from './use-selective-context-dispatch';
import { useSelectiveContextListener } from './use-selective-context-listener';

export default function SelectiveContextManagerNumber({
  children
}: PropsWithChildren) {
  const { dispatch, triggerUpdateRef, contextRef } = useSelectiveContextManager(
    {} as LatestValueRef<number>
  );

  return (
    <UpdateRefContextNumber.Provider value={triggerUpdateRef}>
      <DispatchUpdateContextNumber.Provider value={dispatch}>
        <ContextRefNumber.Provider value={contextRef}>
          {children}
        </ContextRefNumber.Provider>
      </DispatchUpdateContextNumber.Provider>
    </UpdateRefContextNumber.Provider>
  );
}

export function useSelectiveContextDispatchNumber(
  contextKey: string,
  listenerKey: string,
  initialValue: number
) {
  const { currentState, dispatchUpdate } = useSelectiveContextDispatch(
    contextKey,
    listenerKey,
    initialValue,
    UpdateRefContextNumber,
    DispatchUpdateContextNumber,
    ContextRefNumber
  );

  return { currentState, dispatchUpdate };
}

export function useSelectiveContextListenerNumber(
  contextKey: string,
  listenerKey: string,
  fallbackValue?: number
) {
  const { currentState, latestRef } = useSelectiveContextListener(
    contextKey,
    listenerKey,
    fallbackValue || (1 as number),
    UpdateRefContextNumber,
    ContextRefNumber
  );

  return { currentState };
}
