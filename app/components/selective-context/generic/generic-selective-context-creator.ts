'use client';
import { createContext, Dispatch, MutableRefObject } from 'react';
import {
  LatestValueRef,
  ListenerRefInterface,
  UpdateAction
} from '../selective-context-manager';

export function createSelectiveContext<T>() {
  const latestValueRefContext = createContext<
    MutableRefObject<LatestValueRef<T>>
  >({} as MutableRefObject<LatestValueRef<T>>);
  const listenerRefContext = createContext<
    MutableRefObject<ListenerRefInterface<T>>
  >({} as MutableRefObject<ListenerRefInterface<T>>);
  const dispatchContext = createContext<Dispatch<UpdateAction<T>>>(() => {});
  return { latestValueRefContext, listenerRefContext, dispatchContext };
}
