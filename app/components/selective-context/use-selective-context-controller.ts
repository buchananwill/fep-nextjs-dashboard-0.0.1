import React, {
  Dispatch,
  MutableRefObject,
  useContext,
  useEffect,
  useState
} from 'react';
import {
  LatestValueRef,
  UpdateAction,
  UpdateRefInterface
} from './selective-context-manager';
import { useSelectiveContextListener } from './use-selective-context-listener';

export interface UseSelectiveContextDispatchReturn<T> {
  currentState: T;
  dispatchUpdate: (action: UpdateAction<T>) => void;
}

export type UseSelectiveContextDispatch<T> = (
  contextKey: string,
  listenerKey: string,
  initialValue: T
) => UseSelectiveContextDispatchReturn<T>;

export function useSelectiveContextController<T>(
  contextKey: string,
  listenerKey: string,
  initialValue: T,
  UpdateTriggerRefContext: React.Context<
    MutableRefObject<UpdateRefInterface<T>>
  >,
  dispatchUpdateContext: React.Context<(value: UpdateAction<T>) => void>,
  latestValueRefContext: React.Context<MutableRefObject<LatestValueRef<T>>>
) {
  const { currentState, latestRef, updateTriggers } =
    useSelectiveContextListener(
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
      // console.log(contextKey, ' is undefined , setting to ', initialValue);
      freshRef[contextKey] = initialValue;
    }
  }, [latestRef, freshRef, initialValue, contextKey]);

  useEffect(() => {
    if (!isInitialized) {
      dispatchUpdate({ contextKey: contextKey, value: initialValue });
      if (currentState === initialValue) {
        setIsInitialized(true);
      } else {
      }
    }
  }, [currentState, isInitialized, contextKey, initialValue, dispatchUpdate]);
  return { currentState, dispatchUpdate: dispatch };
}
