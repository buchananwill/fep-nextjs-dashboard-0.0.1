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
} from '../base/selective-context-manager';
import { useSelectiveContextController } from '../../hooks/generic/use-selective-context-controller';
import { useSelectiveContextListener } from '../../hooks/generic/use-selective-context-listener';
import { useSelectiveContextDispatch } from '../../hooks/generic/use-selective-context-dispatch';

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

export function useSelectiveContextControllerBoolean(
  contextKey: string,
  listenerKey: string,
  initialValue: boolean
) {
  const { currentState, dispatchUpdate } = useSelectiveContextController(
    contextKey,
    listenerKey,
    initialValue,
    UpdateRefContextBoolean,
    ContextRefBoolean,
    DispatchUpdateContextBoolean
  );

  return { currentState, dispatchUpdate };
}

export function useSelectiveContextDispatchBoolean(
  contextKey: string,
  listenerKey: string,
  initialValue: boolean
) {
  return useSelectiveContextDispatch(
    contextKey,
    listenerKey,
    initialValue,
    UpdateRefContextBoolean,
    ContextRefBoolean,
    DispatchUpdateContextBoolean
  );
}

export function useSelectiveContextListenerBoolean(
  contextKey: string,
  listenerKey: string,
  fallbackValue: boolean
) {
  const { currentState } = useSelectiveContextListener(
    contextKey,
    listenerKey,
    fallbackValue,
    UpdateRefContextBoolean,
    ContextRefBoolean
  );

  return { isTrue: currentState };
}
