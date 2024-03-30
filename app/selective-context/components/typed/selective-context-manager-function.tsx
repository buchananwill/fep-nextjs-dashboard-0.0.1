'use client';
import { PropsWithChildren } from 'react';
import {
  ContextRefFunction,
  DispatchUpdateContextFunction,
  GenericFunction,
  UpdateRefContextFunction
} from './selective-context-creator';
import {
  LatestValueRef,
  useSelectiveContextManager
} from '../base/selective-context-manager';
import { useSelectiveContextController } from '../../hooks/generic/use-selective-context-controller';
import { useSelectiveContextListener } from '../../hooks/generic/use-selective-context-listener';
import { useSelectiveContextDispatch } from '../../hooks/generic/use-selective-context-dispatch';

// This wrapper function is necessary in order to use state to store functions of the type T => T. Otherwise, it automatically tries to call such functions.
export interface GenericFunctionWrapper<T, U> {
  cachedFunction: GenericFunction<T, U>;
}

export const ObjectPlaceholder = {} as const;

export default function SelectiveContextManagerFunction({
  children
}: PropsWithChildren) {
  const { dispatch, triggerUpdateRef, contextRef } = useSelectiveContextManager(
    {} as LatestValueRef<GenericFunctionWrapper<any, any>>
  );

  return (
    <DispatchUpdateContextFunction.Provider value={dispatch}>
      <UpdateRefContextFunction.Provider value={triggerUpdateRef}>
        <ContextRefFunction.Provider value={contextRef}>
          {children}
        </ContextRefFunction.Provider>
      </UpdateRefContextFunction.Provider>
    </DispatchUpdateContextFunction.Provider>
  );
}

export function useSelectiveContextControllerFunction<T, U>(
  contextKey: string,
  listenerKey: string,
  initialValue: GenericFunctionWrapper<T, U>
) {
  const { currentState, dispatchUpdate } = useSelectiveContextController<
    GenericFunctionWrapper<T, U>
  >(
    contextKey,
    listenerKey,
    initialValue,
    UpdateRefContextFunction,
    ContextRefFunction,
    DispatchUpdateContextFunction
  );

  return { currentState, dispatchUpdate };
}

export function useSelectiveContextDispatchFunction<T, U>(
  contextKey: string,
  listenerKey: string,
  initialValue: GenericFunctionWrapper<T, U>
) {
  return useSelectiveContextDispatch<GenericFunctionWrapper<T, U>>(
    contextKey,
    listenerKey,
    initialValue,
    UpdateRefContextFunction,
    ContextRefFunction,
    DispatchUpdateContextFunction
  );
}

export function useSelectiveContextListenerFunction<T, U>(
  contextKey: string,
  listenerKey: string,
  fallBackValue: GenericFunctionWrapper<T, U>
) {
  const { currentState } = useSelectiveContextListener<
    GenericFunctionWrapper<T, U>
  >(
    contextKey,
    listenerKey,
    fallBackValue,
    UpdateRefContextFunction,
    ContextRefFunction
  );

  return { currentFunction: currentState };
}
