'use client';
import {
  useSelectiveContextController,
  UseSelectiveContextParams
} from '../use-selective-context-controller';
import { GenericSelectiveContextProps } from './generic-selective-context-manager';

export function getSelectiveContextControllerHook<T>({
  dispatchContext,
  latestValueRefContext,
  listenerRefContext
}: GenericSelectiveContextProps<T>) {
  return ({
    contextKey,
    initialValue,
    listenerKey
  }: UseSelectiveContextParams<T>) => {
    const { currentState, dispatchUpdate } = useSelectiveContextController(
      contextKey,
      listenerKey,
      initialValue,
      listenerRefContext,
      latestValueRefContext,
      dispatchContext
    );

    return { currentState, dispatchUpdate };
  };
}
