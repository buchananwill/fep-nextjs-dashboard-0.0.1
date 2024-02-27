import React, {
  MutableRefObject,
  useContext,
  useEffect,
  useState
} from 'react';
import {
  ContextRef,
  UpdateAction,
  UpdateRefInterface
} from './selective-context-manager';
import { useSelectiveContextListener } from './use-selective-context-listener';

export function useSelectiveContextDispatch<T>(
  contextKey: string,
  initialValue: T,
  UpdateTriggerRefContext: React.Context<
    MutableRefObject<UpdateRefInterface<T>>
  >,
  dispatchUpdateContext: React.Context<(value: UpdateAction<T>) => void>,
  contextRefContext: React.Context<MutableRefObject<ContextRef<T>>>,
  listenerKey?: string
) {
  const definedListenerKey = listenerKey ? listenerKey : contextKey;
  const { currentState, setCurrentState, latestRef } =
    useSelectiveContextListener(
      contextKey,
      definedListenerKey,
      UpdateTriggerRefContext,
      contextRefContext,
      initialValue
    );

  // const mutableRefObject = useContext(UpdateTriggerRefContext);
  // const latestRef = useContext(contextRefContext);
  const dispatchUpdate = useContext(dispatchUpdateContext);
  const [isInitialized, setIsInitialized] = useState(false);
  // const latest = latestRef.current[contextKey];
  // const [currentState, setCurrentState] = useState(latest || initialValue);
  // const currentElement = mutableRefObject.current[contextKey];
  // if (currentElement === undefined) {
  //   mutableRefObject.current[contextKey] = {};
  // }

  useEffect(() => {
    console.log('Other hook', initialValue, latestRef.current[contextKey]);
    if (latestRef.current[contextKey] === undefined) {
      dispatchUpdate({ contextKey: contextKey, value: initialValue });
      // latestRef.current[contextKey] = initialValue;
    }
  }, [latestRef, initialValue, dispatchUpdate, contextKey]);

  useEffect(() => {
    console.log('Initializing hook');
    if (!isInitialized) {
      dispatchUpdate({ contextKey: contextKey, value: initialValue });
      setIsInitialized(true);
      // Object.values(currentElement).forEach((value) => value(currentState));
      // currentElement[definedListenerKey] = setCurrentState;
    }
  }, [
    isInitialized,
    definedListenerKey,
    contextKey,
    initialValue,
    dispatchUpdate
  ]);
  return { currentState, dispatchUpdate };
}
