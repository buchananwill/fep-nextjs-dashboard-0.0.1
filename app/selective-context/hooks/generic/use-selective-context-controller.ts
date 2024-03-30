'use client';
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState
} from 'react';
import {
  LatestValueRef,
  UpdateAction,
  ListenerRefInterface
} from '../../components/base/selective-context-manager';
import { useSelectiveContextListener } from './use-selective-context-listener';

export interface UseSelectiveContextParams<T> {
  contextKey: string;
  listenerKey: string;
  initialValue: T;
}

export interface UseSelectiveContextControllerReturn<T> {
  currentState: T;
  dispatchUpdate: (action: UpdateAction<T>) => void;
}
export interface UseSelectiveContextDispatchReturn<T> {
  currentState: T;
  dispatchWithoutControl: Dispatch<SetStateAction<T>>;
}

export type UseSelectiveContextDispatch<T> = (
  params: UseSelectiveContextParams<T>
) => UseSelectiveContextDispatchReturn<T>;

export type UseSelectiveContextController<T> = (
  params: UseSelectiveContextParams<T>
) => UseSelectiveContextControllerReturn<T>;

export function useSelectiveContextController<T>(
  contextKey: string,
  listenerKey: string,
  initialValue: T,
  UpdateTriggerRefContext: React.Context<
    React.MutableRefObject<ListenerRefInterface<T>>
  >,
  latestValueRefContext: React.Context<
    React.MutableRefObject<LatestValueRef<T>>
  >,
  dispatchUpdateContext: React.Context<(value: UpdateAction<T>) => void>
) {
  const { currentState, latestRef } = useSelectiveContextListener(
    contextKey,
    listenerKey,
    initialValue,
    UpdateTriggerRefContext,
    latestValueRefContext
  );

  const freshRef = latestRef.current;

  const dispatchUpdate = useContext(dispatchUpdateContext);

  const dispatch = (action: UpdateAction<T>) => dispatchUpdate(action);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (freshRef[contextKey] === undefined) {
      freshRef[contextKey] = initialValue;
    }
  }, [latestRef, freshRef, initialValue, contextKey]);

  useEffect(() => {
    if (!isInitialized) {
      dispatchUpdate({ contextKey: contextKey, update: initialValue });
      if (currentState === initialValue) {
        setIsInitialized(true);
      } else {
      }
    }
  }, [currentState, isInitialized, contextKey, initialValue, dispatchUpdate]);
  return { currentState, dispatchUpdate: dispatch };
}
