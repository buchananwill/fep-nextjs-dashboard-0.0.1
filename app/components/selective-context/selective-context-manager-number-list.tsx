'use client';
import { PropsWithChildren } from 'react';
import {
  ContextRefNumberList,
  ContextRefStringList,
  DispatchUpdateContextNumberList,
  DispatchUpdateContextStringList,
  UpdateRefContextNumberList,
  UpdateRefContextStringList
} from './selective-context-creator';
import {
  LatestValueRef,
  useSelectiveContextManager
} from './selective-context-manager';

import {
  UseSelectiveContextDispatch,
  useSelectiveContextDispatch
} from './use-selective-context-dispatch';
import {
  UseSelectiveContextListener,
  useSelectiveContextListener
} from './use-selective-context-listener';

export default function SelectiveContextManagerNumberList({
  children
}: PropsWithChildren) {
  const { dispatch, triggerUpdateRef, contextRef } = useSelectiveContextManager(
    {} as LatestValueRef<number[]>
  );

  return (
    <DispatchUpdateContextNumberList.Provider value={dispatch}>
      <UpdateRefContextNumberList.Provider value={triggerUpdateRef}>
        <ContextRefNumberList.Provider value={contextRef}>
          {children}
        </ContextRefNumberList.Provider>
      </UpdateRefContextNumberList.Provider>
    </DispatchUpdateContextNumberList.Provider>
  );
}

export const useSelectiveContextDispatchNumberList: UseSelectiveContextDispatch<
  number[]
> = (contextKey: string, listenerKey: string, initialValue: number[]) => {
  const { currentState, dispatchUpdate } = useSelectiveContextDispatch(
    contextKey,
    listenerKey,
    initialValue,
    UpdateRefContextNumberList,
    DispatchUpdateContextNumberList,
    ContextRefNumberList
  );

  return { currentState, dispatchUpdate };
};

export const useSelectiveContextListenerNumberList: UseSelectiveContextListener<
  number[]
> = (contextKey: string, listenerKey: string, fallbackValue: number[]) => {
  const { currentState, latestRef } = useSelectiveContextListener(
    contextKey,
    listenerKey,
    fallbackValue,
    UpdateRefContextNumberList,
    ContextRefNumberList
  );

  return { currentState };
};
