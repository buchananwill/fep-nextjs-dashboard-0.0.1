'use client';
import { PropsWithChildren } from 'react';
import {
  ContextRefBoolean,
  DispatchUpdateContextBoolean,
  UpdateRefContextBoolean,
  useSelectiveContextDispatch,
  useSelectiveContextListener
} from './selective-context-creator';
import {
  ContextRef,
  useSelectiveContextManager
} from './selective-context-manager';

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
  listenerKey: string
) {
  const { currentState, latestRef } = useSelectiveContextListener(
    contextKey,
    listenerKey,
    UpdateRefContextBoolean,
    ContextRefBoolean,
    false as boolean
  );

  return { isTrue: currentState };
}
