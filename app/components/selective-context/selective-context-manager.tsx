import { MutableRefObject, useEffect, useReducer, useRef } from 'react';

export interface UpdateRefInterface<T> {
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

export function useSelectiveContextManager<T>(
  initialContext: LatestValueRef<T>
) {
  const triggerUpdateRef = useRef({} as UpdateRefInterface<T>);

  const latestValueRef = useRef(initialContext);

  const dispatch = (action: UpdateAction<T>) => {
    const { contextKey, value } = action;
    const currentElement = latestValueRef.current[contextKey];
    const listeners = triggerUpdateRef.current[contextKey];

    if (!listeners) {
      console.log('about to log an error:', listeners);
      throw new Error(
        `No listeners found for this context: ${contextKey} with value ${value}`
      );
    }

    if (currentElement !== value) {
      console.log('updating', contextKey);
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
  };

  return { dispatch, triggerUpdateRef, contextRef: latestValueRef };
}
