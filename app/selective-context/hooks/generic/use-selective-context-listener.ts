import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  LatestValueRef,
  ListenerRefInterface
} from '../../components/base/selective-context-manager';
import { UseSelectiveContextDispatchReturn } from './use-selective-context-dispatch';

export interface UseSelectiveContextListenerReturn<T> {
  currentState: T;
}

export type UseSelectiveContextListener<T> = (
  contextKey: string,
  listenerKey: string,
  initialValue: T
) => UseSelectiveContextListenerReturn<T>;

export const MockReturn: UseSelectiveContextDispatchReturn<any> = {
  currentState: {} as any,
  dispatchWithoutControl: () => {},
  dispatch: () => {}
};

export function useSelectiveContextListener<T>(
  contextKey: string,
  listenerKey: string,
  fallBackValue: T,
  updateRefContext: React.Context<
    React.MutableRefObject<ListenerRefInterface<T>>
  >,
  latestValueRefContext: React.Context<
    React.MutableRefObject<LatestValueRef<T>>
  >
) {
  const updateTriggers = useContext(updateRefContext);
  const latestRef = useContext(latestValueRefContext);
  let currentValue: LatestValueRef<T> | undefined = undefined;
  try {
    currentValue = latestRef.current;
  } catch (e) {
    console.error(e);
  }

  const initialValue =
    currentValue === undefined ||
    currentValue === null ||
    currentValue[contextKey] === undefined
      ? fallBackValue
      : latestRef.current[contextKey];

  const [currentState, setCurrentState] = useState<T>(initialValue);

  let currentListeners = updateTriggers.current[contextKey];
  if (currentListeners === undefined) {
    updateTriggers.current[contextKey] = {};
    currentListeners = updateTriggers.current[contextKey];
    currentListeners[listenerKey] = setCurrentState;
  }

  useEffect(() => {
    currentListeners[listenerKey] = setCurrentState;
    if (latestRef.current[contextKey] !== undefined) {
      setCurrentState(() => latestRef.current[contextKey]);
    }

    return () => {
      if (currentListeners) {
        delete currentListeners[listenerKey];
      }
    };
  }, [currentListeners, contextKey, listenerKey, latestRef]);

  return { currentState, latestRef, setCurrentState, updateTriggers };
}

export function useSelectiveContextKeyMemo(
  contextKey: string,
  listenerKey: string
) {
  return useMemo(() => {
    return `${contextKey}:${listenerKey}`;
  }, [contextKey, listenerKey]);
}
