'use client';
import { PropsWithChildren } from 'react';
import {
  ContextRefNumberList,
  DispatchUpdateContextNumberList,
  UpdateRefContextNumberList
} from './selective-context-creator';
import {
  LatestValueRef,
  useSelectiveContextManager
} from './selective-context-manager';

import {
  useSelectiveContextController,
  UseSelectiveContextController,
  UseSelectiveContextDispatch
} from '../../hooks/selective-context/use-selective-context-controller';
import {
  useSelectiveContextDispatch,
  UseSelectiveContextListener,
  useSelectiveContextListener
} from '../../hooks/selective-context/use-selective-context-listener';

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

export const useSelectiveContextControllerNumberList: UseSelectiveContextController<
  number[]
> = ({ contextKey, initialValue, listenerKey }) => {
  return useSelectiveContextController(
    contextKey,
    listenerKey,
    initialValue,
    UpdateRefContextNumberList,
    ContextRefNumberList,
    DispatchUpdateContextNumberList
  );
};

export const useSelectiveContextDispatchNumberList: UseSelectiveContextDispatch<
  number[]
> = ({ contextKey, listenerKey, initialValue }) => {
  const { currentState, dispatchWithoutControl } = useSelectiveContextDispatch(
    contextKey,
    listenerKey,
    initialValue,
    UpdateRefContextNumberList,
    ContextRefNumberList,
    DispatchUpdateContextNumberList
  );

  return { currentState, dispatchWithoutControl };
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
