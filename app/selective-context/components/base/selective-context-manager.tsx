import {
  Context,
  Dispatch,
  MutableRefObject,
  useCallback,
  useRef
} from 'react';

export interface ListenerRefInterface<T> {
  [key: string]: SelectiveListeners<T>;
}

export interface SelectiveListeners<T> {
  [key: string]: (update: T) => void;
}

export interface LatestValueRef<T> {
  [key: string]: T;
}

export interface UpdateAction<T> {
  contextKey: string;
  value: T;
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

  const dispatch = useCallback(
    (action: UpdateAction<T>) => {
      const { contextKey, value } = action;
      const currentElement = latestValueRef.current[contextKey];
      const listeners = triggerUpdateRef.current[contextKey];

      if (!listeners) {
        throw new Error(
          `No listeners found for this context: ${contextKey} with value ${value}`
        );
      }

      if (currentElement !== value) {
        try {
          Object.values(listeners).forEach((l) => {
            l(value);
          });
        } catch (e) {
          console.error(e);
        }
        latestValueRef.current[contextKey] = value;
        // }
      }
    },
    [latestValueRef.current, triggerUpdateRef.current]
  );

  return { dispatch, triggerUpdateRef, contextRef: latestValueRef };
}
