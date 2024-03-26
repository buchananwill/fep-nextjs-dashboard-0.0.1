'use client';
import { PropsWithChildren } from 'react';
import {
  LatestValueRef,
  SelectiveDispatchContext,
  SelectiveListenersContext,
  SelectiveValueContext,
  useSelectiveContextManager
} from './selective-context-manager';

export interface GenericSelectiveContextProps<T> {
  listenerRefContext: SelectiveListenersContext<T>;
  latestValueRefContext: SelectiveValueContext<T>;
  dispatchContext: SelectiveDispatchContext<T>;
}

export default function GenericSelectiveContextManager<T>({
  children,
  dispatchContext,
  latestValueRefContext,
  listenerRefContext
}: GenericSelectiveContextProps<T> & PropsWithChildren) {
  const ListenerProvider = listenerRefContext.Provider;
  const DispatchProvider = dispatchContext.Provider;
  const LatestValueProvider = latestValueRefContext.Provider;

  const {
    dispatch,
    triggerUpdateRef: listenerRef,
    contextRef: latestValueRef
  } = useSelectiveContextManager({} as LatestValueRef<T>);

  return (
    <ListenerProvider value={listenerRef}>
      <DispatchProvider value={dispatch}>
        <LatestValueProvider value={latestValueRef}>
          {children}
        </LatestValueProvider>
      </DispatchProvider>
    </ListenerProvider>
  );
}
