'use client';
import { PropsWithChildren } from 'react';
import {
  ContextRefNumber,
  DispatchUpdateContextNumber,
  UpdateRefContextNumber
} from './selective-context-creator';
import {
  LatestValueRef,
  useSelectiveContextManager
} from '../base/selective-context-manager';
import {
  UseSelectiveContextController,
  useSelectiveContextController,
  UseSelectiveContextDispatch,
  UseSelectiveContextParams
} from '../../hooks/generic/use-selective-context-controller';
import {
  UseSelectiveContextListener,
  useSelectiveContextListener
} from '../../hooks/generic/use-selective-context-listener';
import { useSelectiveContextDispatch } from '../../hooks/generic/use-selective-context-dispatch';

export default function SelectiveContextManagerNumber({
  children
}: PropsWithChildren) {
  const { dispatch, triggerUpdateRef, contextRef } = useSelectiveContextManager(
    {} as LatestValueRef<number>
  );

  return (
    <UpdateRefContextNumber.Provider value={triggerUpdateRef}>
      <DispatchUpdateContextNumber.Provider value={dispatch}>
        <ContextRefNumber.Provider value={contextRef}>
          {children}
        </ContextRefNumber.Provider>
      </DispatchUpdateContextNumber.Provider>
    </UpdateRefContextNumber.Provider>
  );
}

export const useSelectiveContextControllerNumber: UseSelectiveContextController<
  number
> = ({
  contextKey,
  initialValue,
  listenerKey
}: UseSelectiveContextParams<number>) => {
  const { currentState, dispatchUpdate } = useSelectiveContextController(
    contextKey,
    listenerKey,
    initialValue,
    UpdateRefContextNumber,
    ContextRefNumber,
    DispatchUpdateContextNumber
  );

  return { currentState, dispatchUpdate };
};
export const useSelectiveContextDispatchNumber: UseSelectiveContextDispatch<
  number
> = ({
  contextKey,
  initialValue,
  listenerKey
}: UseSelectiveContextParams<number>) => {
  const { currentState, dispatchWithoutControl } = useSelectiveContextDispatch(
    contextKey,
    listenerKey,
    initialValue,
    UpdateRefContextNumber,
    ContextRefNumber,
    DispatchUpdateContextNumber
  );

  return { currentState, dispatchWithoutControl };
};

export const useSelectiveContextListenerNumber: UseSelectiveContextListener<
  number
> = (contextKey: string, listenerKey: string, fallbackValue?: number) => {
  const { currentState } = useSelectiveContextListener(
    contextKey,
    listenerKey,
    fallbackValue || (1 as number),
    UpdateRefContextNumber,
    ContextRefNumber
  );

  return { currentState };
};
