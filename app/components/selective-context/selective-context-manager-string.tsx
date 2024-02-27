'use client';
import { PropsWithChildren, useEffect, useState } from 'react';
import {
  ContextRefNumber,
  ContextRefString,
  DispatchUpdateContextNumber,
  DispatchUpdateContextString,
  UpdateRefContextNumber,
  UpdateRefContextString
} from './selective-context-creator';
import {
  LatestValueRef,
  useSelectiveContextManager
} from './selective-context-manager';
import {
  useSelectiveContextDispatchBoolean,
  useSelectiveContextListenerBoolean
} from './selective-context-manager-boolean';
import { useSelectiveContextDispatch } from './use-selective-context-dispatch';
import { useSelectiveContextListener } from './use-selective-context-listener';

export default function SelectiveContextManagerString({
  children
}: PropsWithChildren) {
  const { dispatch, triggerUpdateRef, contextRef } = useSelectiveContextManager(
    {} as LatestValueRef<string>
  );

  return (
    <DispatchUpdateContextString.Provider value={dispatch}>
      <UpdateRefContextString.Provider value={triggerUpdateRef}>
        <ContextRefString.Provider value={contextRef}>
          {children}
        </ContextRefString.Provider>
      </UpdateRefContextString.Provider>
    </DispatchUpdateContextString.Provider>
  );
}

export function useSelectiveContextDispatchString(
  contextKey: string,
  listenerKey: string,
  initialValue: string = ''
) {
  const { currentState, dispatchUpdate } = useSelectiveContextDispatch(
    contextKey,
    initialValue,
    listenerKey,
    UpdateRefContextString,
    DispatchUpdateContextString,
    ContextRefString
  );

  return { currentState, dispatchUpdate };
}

export function useSelectiveContextListenerString(
  contextKey: string,
  listenerKey: string
) {
  const { currentState, latestRef } = useSelectiveContextListener(
    contextKey,
    listenerKey,
    '',
    UpdateRefContextString,
    ContextRefString
  );

  return { currentState };
}
