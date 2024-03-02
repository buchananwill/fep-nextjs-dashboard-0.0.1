'use client';
import { PropsWithChildren } from 'react';
import {
  ContextRefStringList,
  DispatchUpdateContextStringList,
  UpdateRefContextStringList
} from './selective-context-creator';
import {
  LatestValueRef,
  useSelectiveContextManager
} from './selective-context-manager';

import { useSelectiveContextController } from './use-selective-context-controller';
import { useSelectiveContextListener } from './use-selective-context-listener';

export default function SelectiveContextManagerStringList({
  children
}: PropsWithChildren) {
  const { dispatch, triggerUpdateRef, contextRef } = useSelectiveContextManager(
    {} as LatestValueRef<string[]>
  );

  return (
    <DispatchUpdateContextStringList.Provider value={dispatch}>
      <UpdateRefContextStringList.Provider value={triggerUpdateRef}>
        <ContextRefStringList.Provider value={contextRef}>
          {children}
        </ContextRefStringList.Provider>
      </UpdateRefContextStringList.Provider>
    </DispatchUpdateContextStringList.Provider>
  );
}

export function useSelectiveContextDispatchStringList(
  contextKey: string,
  listenerKey: string,
  initialValue: string[]
) {
  const { currentState, dispatchUpdate } = useSelectiveContextController(
    contextKey,
    listenerKey,
    initialValue,
    UpdateRefContextStringList,
    DispatchUpdateContextStringList,
    ContextRefStringList
  );

  return { currentState, dispatchUpdate };
}

export function useSelectiveContextListenerStringList(
  contextKey: string,
  listenerKey: string,
  fallbackValue: string[]
) {
  const { currentState, latestRef } = useSelectiveContextListener(
    contextKey,
    listenerKey,
    fallbackValue,
    UpdateRefContextStringList,
    ContextRefStringList
  );

  return { currentState };
}
