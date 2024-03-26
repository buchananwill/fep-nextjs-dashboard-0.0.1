'use client';
import { GenericSelectiveContextProps } from '../../components/selective-context/generic-selective-context-manager';

import {
  UseSelectiveContextDispatch,
  useSelectiveContextDispatch
} from './use-selective-context-listener';

export default function getSelectiveContextDispatchHook<T>({
  latestValueRefContext,
  dispatchContext,
  listenerRefContext
}: GenericSelectiveContextProps<T>): UseSelectiveContextDispatch<T> {
  return (contextKey, listenerKey, initialValue) => {
    const { currentState, dispatchWithoutControl, dispatch } =
      useSelectiveContextDispatch(
        contextKey,
        listenerKey,
        initialValue,
        listenerRefContext,
        latestValueRefContext,
        dispatchContext
      );

    return { currentState, dispatchWithoutControl, dispatch };
  };
}
