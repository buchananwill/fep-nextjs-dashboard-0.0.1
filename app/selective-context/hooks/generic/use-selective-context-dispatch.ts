import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext
} from 'react';
import {
  LatestValueRef,
  ListenerRefInterface,
  UpdateAction
} from '../../components/base/selective-context-manager';
import { useSelectiveContextListener } from './use-selective-context-listener';

export interface UseSelectiveContextDispatchReturn<T> {
  currentState: T;
  dispatchWithoutControl: (proposedValue: T) => void;
  dispatch: Dispatch<UpdateAction<T>>;
}

export type UseSelectiveContextDispatch<T> = (
  contextKey: string,
  listenerKey: string,
  initialValue: T
) => UseSelectiveContextDispatchReturn<T>;

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
  dispatchUpdateContext: React.Context<Dispatch<UpdateAction<T>>>
) {
  const { currentState } = useSelectiveContextListener(
    contextKey,
    listenerKey,
    fallBackValue,
    updateRefContext,
    latestValueRefContext
  );

  const dispatch = useContext(dispatchUpdateContext);

  const dispatchWithoutControl = useCallback(
    (proposedUpdate: SetStateAction<T>) => {
      dispatch({ contextKey, update: proposedUpdate });
    },
    [contextKey, dispatch]
  );

  return { currentState, dispatchWithoutControl, dispatch };
}
