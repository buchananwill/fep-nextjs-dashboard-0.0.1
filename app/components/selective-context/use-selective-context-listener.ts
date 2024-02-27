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

  let currentElement = updateTriggers.current[contextKey];
  if (currentElement === undefined) {
    updateTriggers.current[contextKey] = {};
    currentElement = updateTriggers.current[contextKey];
    currentElement[listenerKey] = setCurrentState;
  }

  useEffect(() => {
    currentElement[listenerKey] = setCurrentState;
    setCurrentState(() => latestRef.current[contextKey]);

    return () => {
      if (currentElement) {
        delete currentElement[listenerKey];
      }
    };
  }, [
    currentElement,
    updateTriggers,
    contextKey,
    listenerKey,
    updateRefContext,
    latestRef
  ]);

  return { currentState, latestRef, setCurrentState, updateTriggers };
}
