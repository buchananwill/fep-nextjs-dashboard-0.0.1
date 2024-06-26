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
} from '../base/selective-context-manager';

import {
  useSelectiveContextController,
  UseSelectiveContextDispatch
} from '../../hooks/generic/use-selective-context-controller';
import { useSelectiveContextListener } from '../../hooks/generic/use-selective-context-listener';
import { useSelectiveContextDispatch } from '../../hooks/generic/use-selective-context-dispatch';

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

export function useSelectiveContextControllerStringList(
  contextKey: string,
  listenerKey: string,
  initialValue: string[]
) {
  const { currentState, dispatchUpdate } = useSelectiveContextController(
    contextKey,
    listenerKey,
    initialValue,
    UpdateRefContextStringList,
    ContextRefStringList,
    DispatchUpdateContextStringList
  );

  return { currentState, dispatchUpdate };
}

export const useSelectiveContextDispatchStringList: UseSelectiveContextDispatch<
  string[]
> = ({ contextKey, initialValue, listenerKey }) => {
  return useSelectiveContextDispatch<string[]>(
    contextKey,
    listenerKey,
    initialValue,
    UpdateRefContextStringList,
    ContextRefStringList,
    DispatchUpdateContextStringList
  );
};

export function useSelectiveContextListenerStringList(
  contextKey: string,
  listenerKey: string,
  fallbackValue: string[]
) {
  const { currentState } = useSelectiveContextListener(
    contextKey,
    listenerKey,
    fallbackValue,
    UpdateRefContextStringList,
    ContextRefStringList
  );

  return { currentState };
}
