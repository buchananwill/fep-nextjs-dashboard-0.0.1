'use client';
import { PropsWithChildren } from 'react';
import {
  ContextRefBoolean,
  DispatchUpdateContextBoolean,
  UpdateRefContextBoolean
} from './selective-context-creator';
import {
  LatestValueRef,
  useSelectiveContextManager
} from './selective-context-manager';
import { useSelectiveContextDispatch } from './use-selective-context-dispatch';
import { useSelectiveContextListener } from './use-selective-context-listener';

export default function SelectiveContextManagerBoolean({
  children
}: PropsWithChildren) {
  const { dispatch, triggerUpdateRef, contextRef } = useSelectiveContextManager(
    {} as LatestValueRef<boolean>
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
  listenerKey: string,
  initialValue: boolean
) {
  const { currentState, dispatchUpdate } = useSelectiveContextDispatch(
    contextKey,
    listenerKey,
    initialValue,
    UpdateRefContextBoolean,
    DispatchUpdateContextBoolean,
    ContextRefBoolean
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
    fallbackValue,
    UpdateRefContextBoolean,
    ContextRefBoolean
  );

  return { isTrue: currentState };
}
