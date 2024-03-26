'use client';
import {
  createContext,
  Dispatch,
  MutableRefObject,
  useCallback,
  useContext
} from 'react';
import {
  LatestValueRef,
  ListenerRefInterface,
  SelectiveDispatchContext,
  SelectiveListenersContext,
  SelectiveValueContext,
  UpdateAction
} from '../selective-context-manager';

export function createSelectiveContext<T>(): SelectiveContext<T> {
  const latestValueRefContext = createContext<
    MutableRefObject<LatestValueRef<T>>
  >({} as MutableRefObject<LatestValueRef<T>>);
  const listenerRefContext = createContext<
    MutableRefObject<ListenerRefInterface<T>>
  >({} as MutableRefObject<ListenerRefInterface<T>>);
  const dispatchContext = createContext<Dispatch<UpdateAction<T>>>(() => {});
  return { latestValueRefContext, listenerRefContext, dispatchContext };
}

export interface SelectiveContext<T> {
  latestValueRefContext: SelectiveValueContext<T>;
  listenerRefContext: SelectiveListenersContext<T>;
  dispatchContext: SelectiveDispatchContext<T>;
}

export interface SelectiveContextReadAll<T> {
  (contextKey: string): T | undefined;
}

export function useSelectiveContextListenerReadAll<T>(
  context: SelectiveContext<T>
): SelectiveContextReadAll<T> {
  const mutableRefObject = useContext(context.latestValueRefContext);
  return useCallback(
    function (contextKey) {
      return mutableRefObject.current[contextKey];
    },
    [mutableRefObject]
  );
}
