'use client';
import { PropsWithChildren } from 'react';
import {
  ContextRefString,
  DispatchUpdateContextString,
  UpdateRefContextString
} from './selective-context-creator';
import {
  LatestValueRef,
  useSelectiveContextManager
} from '../base/selective-context-manager';
import { useSelectiveContextController } from '../../hooks/generic/use-selective-context-controller';
import { useSelectiveContextListener } from '../../hooks/generic/use-selective-context-listener';
import { useSelectiveContextDispatch } from '../../hooks/generic/use-selective-context-dispatch';

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

export function useSelectiveContextControllerString(
  contextKey: string,
  listenerKey: string,
  initialValue: string = ''
) {
  const { currentState, dispatchUpdate } = useSelectiveContextController(
    contextKey,
    listenerKey,
    initialValue,
    UpdateRefContextString,
    ContextRefString,
    DispatchUpdateContextString
  );

  return { currentState, dispatchUpdate };
}

export function useSelectiveContextDispatchString(
  contextKey: string,
  listenerKey: string,
  initialValue: string = ''
) {
  return useSelectiveContextDispatch(
    contextKey,
    initialValue,
    listenerKey,
    UpdateRefContextString,
    ContextRefString,
    DispatchUpdateContextString
  );
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
