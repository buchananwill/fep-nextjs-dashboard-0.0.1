import {
  Context,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef
} from 'react';
import { isNotUndefined } from '../../../api/main';

export interface ListenerRefInterface<T> {
  [key: string]: SelectiveListeners<T>;
}

export interface SelectiveListeners<T> {
  [key: string]: Dispatch<SetStateAction<T>>;
}

export interface LatestValueRef<T> {
  [key: string]: T;
}

export interface UpdateAction<T> {
  contextKey: string;
  update: SetStateAction<T>;
}

export type SelectiveListenersContext<T> = Context<
  MutableRefObject<ListenerRefInterface<T>>
>;
export type SelectiveDispatchContext<T> = Context<Dispatch<UpdateAction<T>>>;
export type SelectiveValueContext<T> = Context<
  MutableRefObject<LatestValueRef<T>>
>;

export function useSelectiveContextManager<T>(
  initialContext: LatestValueRef<T>
) {
  const triggerUpdateRef = useRef({} as ListenerRefInterface<T>);
  const latestValueRef = useRef(initialContext);

  const intervalClearRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const cachedListenerRef = triggerUpdateRef.current;
    const cachedValueRef = latestValueRef.current;
    intervalClearRef.current = setInterval(() => {
      for (let [contextKey, listeners] of Object.entries(cachedListenerRef)) {
        if (
          Object.values(listeners).length === 0 &&
          isNotUndefined(cachedValueRef[contextKey])
        ) {
          delete cachedValueRef[contextKey];
        }
      }
    }, 30_000);
    return () => {
      clearInterval(intervalClearRef.current);
    };
  }, []);

  const dispatch = useCallback((action: UpdateAction<T>) => {
    const { contextKey, update } = action;
    const currentElement = latestValueRef.current[contextKey];
    const listeners = triggerUpdateRef.current[contextKey];

    if (!listeners) {
      throw new Error(
        `No listeners found for this context: ${contextKey} with value ${update}`
      );
    }

    let newValue = currentElement;
    if (update instanceof Function) {
      newValue = update(currentElement);
    } else {
      newValue = update;
    }

    if (currentElement !== newValue) {
      try {
        Object.values(listeners).forEach((l) => {
          l(newValue);
        });
      } catch (e) {
        console.error(e);
      }
      latestValueRef.current[contextKey] = newValue;
    }
  }, []);

  return { dispatch, triggerUpdateRef, contextRef: latestValueRef };
}
