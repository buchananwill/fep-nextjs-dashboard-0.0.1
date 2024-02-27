'use client';
import { PropsWithChildren } from 'react';
import {
  ContextRefBoolean,
  DispatchUpdateContextBoolean,
  UpdateRefContextBoolean
} from './selective-context-creator';
import {
  ContextRef,
  useSelectiveContextManager
} from './selective-context-manager';
import { useSelectiveContextDispatch } from './use-selective-context-dispatch';
import { useSelectiveContextListener } from './use-selective-context-listener';

export default function SelectiveContextManagerBoolean({
  children
}: PropsWithChildren) {
  const { dispatch, triggerUpdateRef, contextRef } = useSelectiveContextManager(
    {} as ContextRef<boolean>
  );

  return (
    <DispatchUpdateContextBoolean.Provider value={dispatch}>
      <UpdateRefContextBoolean.Provider value={triggerUpdateRef}>
        <ContextRefBoolean.Provider value={contextRef}>
          {children}
        </ContextRefBoolean.Provider>
      </UpdateRefContextBoolean.Provider>
    </DispatchUpdateContextBoolean.Provider>
  );
}

export function useSelectiveContextDispatchBoolean(
  contextKey: string,
  initialValue: boolean,
  listenerKey?: string
) {
  const { currentState, dispatchUpdate } = useSelectiveContextDispatch(
    contextKey,
    initialValue,
    UpdateRefContextBoolean,
    DispatchUpdateContextBoolean,
    ContextRefBoolean,
    listenerKey || contextKey
  );

  return { isTrue: currentState, dispatchUpdate };
}

export function useSelectiveContextListenerBoolean(
  contextKey: string,
  listenerKey: string,
  fallbackValue: boolean
) {
  const { currentState, latestRef } = useSelectiveContextListener(
    contextKey,
    listenerKey,
    UpdateRefContextBoolean,
    ContextRefBoolean,
    fallbackValue
  );

  return { isTrue: currentState };
}
