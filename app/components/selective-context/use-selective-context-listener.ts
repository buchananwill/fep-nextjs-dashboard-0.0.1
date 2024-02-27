import React, { MutableRefObject, useContext, useState } from 'react';
import { ContextRef, UpdateRefInterface } from './selective-context-manager';

export function useSelectiveContextListener<T>(
  contextKey: string,
  listenerKey: string,
  updateRefContext: React.Context<
    React.MutableRefObject<UpdateRefInterface<T>>
  >,
  contextRefContext: React.Context<MutableRefObject<ContextRef<T>>>,
  fallBackValue: T
) {
  const mutableRefObject = useContext(updateRefContext);
  const latestRef = useContext(contextRefContext);

  const [currentState, setCurrentState] = useState<T>(() => {
    return latestRef.current[contextKey] === undefined
      ? fallBackValue
      : latestRef.current[contextKey];
  });

  const currentElement = mutableRefObject.current[contextKey];
  if (currentElement === undefined) {
    mutableRefObject.current[contextKey] = {};
  }
  mutableRefObject.current[contextKey][listenerKey] = setCurrentState;

  return { currentState, latestRef, setCurrentState };
}
