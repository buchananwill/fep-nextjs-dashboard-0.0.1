'use client';
import { PropsWithChildren, useEffect, useState } from 'react';
import {
  ContextRefNumber,
  ContextRefString,
  ContextRefStringList,
  DispatchUpdateContextNumber,
  DispatchUpdateContextString,
  DispatchUpdateContextStringList,
  UpdateRefContextNumber,
  UpdateRefContextString,
  UpdateRefContextStringList
} from './selective-context-creator';
import {
  ContextRef,
  useSelectiveContextManager
} from './selective-context-manager';
import {
  useSelectiveContextDispatchBoolean,
  useSelectiveContextListenerBoolean
} from './selective-context-manager-boolean';
import { useSelectiveContextDispatch } from './use-selective-context-dispatch';
import { useSelectiveContextListener } from './use-selective-context-listener';

export default function SelectiveContextManagerStringList({
  children
}: PropsWithChildren) {
  const { dispatch, triggerUpdateRef, contextRef } = useSelectiveContextManager(
    {} as ContextRef<string[]>
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
  initialValue: string[],
  listenerKey?: string
) {
  const { currentState, dispatchUpdate } = useSelectiveContextDispatch(
    contextKey,
    initialValue,
    UpdateRefContextStringList,
    DispatchUpdateContextStringList,
    ContextRefStringList,
    listenerKey || contextKey
  );

  return { currentState, dispatchUpdate };
}

export function useSelectiveContextListenerStringList(
  contextKey: string,
  listenerKey: string
) {
  const { currentState, latestRef } = useSelectiveContextListener(
    contextKey,
    listenerKey,
    UpdateRefContextStringList,
    ContextRefStringList,
    []
  );

  return { currentState };
}
