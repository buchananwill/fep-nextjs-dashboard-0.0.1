import React, {
  MutableRefObject,
  useContext,
  useEffect,
  useState
} from 'react';
import {
  LatestValueRef,
  UpdateRefInterface
} from './selective-context-manager';

export function useSelectiveContextListener<T>(
  contextKey: string,
  listenerKey: string,
  fallBackValue: T,
  updateRefContext: React.Context<
    React.MutableRefObject<UpdateRefInterface<T>>
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
    console.log(
      'With: ',
      contextKey,
      listenerKey,
      updateRefContext,
      latestValueRefContext,
      fallBackValue
    );
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
    setCurrentState(() => latestRef.current[contextKey]);

    return () => {
      if (currentListeners) {
        delete currentListeners[listenerKey];
      }
    };
  }, [currentListeners, contextKey, listenerKey, latestRef]);

  return { currentState, latestRef, setCurrentState, updateTriggers };
}
