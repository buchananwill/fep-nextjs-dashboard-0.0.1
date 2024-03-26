import React, {
  Dispatch,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import {
  LatestValueRef,
  UpdateAction,
  ListenerRefInterface
} from '../../components/selective-context/selective-context-manager';

export interface UseSelectiveContextListenerReturn<T> {
  currentState: T;
}

export type UseSelectiveContextListener<T> = (
  contextKey: string,
  listenerKey: string,
  initialValue: T
) => UseSelectiveContextListenerReturn<T>;

export interface UseSelectiveContextDispatchReturn<T> {
  currentState: T;
  dispatchWithoutControl: (proposedValue: T) => void;
  dispatch: Dispatch<UpdateAction<T>>;
}

export const MockReturn: UseSelectiveContextDispatchReturn<any> = {
  currentState: {} as any,
  dispatchWithoutControl: () => {},
  dispatch: () => {}
};

export type UseSelectiveContextDispatch<T> = (
  contextKey: string,
  listenerKey: string,
  initialValue: T
) => UseSelectiveContextDispatchReturn<T>;

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

export function useSelectiveContextDispatch<T>(
  contextKey: string,
  listenerKey: string,
  fallBackValue: T,
  updateRefContext: React.Context<
    React.MutableRefObject<ListenerRefInterface<T>>
  >,
  latestValueRefContext: React.Context<
    React.MutableRefObject<LatestValueRef<T>>
  >,
  dispatchUpdateContext: React.Context<(value: UpdateAction<T>) => void>
) {
  const { currentState } = useSelectiveContextListener(
    contextKey,
    listenerKey,
    fallBackValue,
    updateRefContext,
    latestValueRefContext
  );

  const dispatch = useContext(dispatchUpdateContext);

  const dispatchWithoutControl = (proposedValue: T) => {
    dispatch({ contextKey, value: proposedValue });
  };

  return { currentState, dispatchWithoutControl, dispatch };
}

export function useSelectiveContextKeyMemo(
  contextKey: string,
  listenerKey: string
) {
  return useMemo(() => {
    return `${contextKey}:${listenerKey}`;
  }, [contextKey, listenerKey]);
}
