import { MutableRefObject, useEffect, useReducer, useRef } from 'react';

export interface UpdateRefInterface<T> {
  [key: string]: SelectiveListeners<T>;
}

export interface SelectiveListeners<T> {
  [key: string]: (update: T) => void;
}

export interface UpdateTrigger<T> {
  key: string;
  updateAction: (update: T) => void;
}
export interface ContextRef<T> {
  [key: string]: T;
}

export interface UpdateAction<T> {
  contextKey: string;
  value: T;
}

function DispatchUpdateContextReducer<T>(
  state: ContextRef<T>,
  action: UpdateAction<T>
) {
  const { contextKey, value } = action;
  return { ...state, [contextKey]: value };
}

export function validateUpdatedContext<T>(
  contextRef: MutableRefObject<ContextRef<T>>,
  updatedContext: ContextRef<T>
) {
  const staleContexts: string[] = [];

  for (let key of Object.keys(contextRef.current)) {
    const prev = contextRef.current[key];
    const curr = updatedContext[key];

    if (prev != curr) {
      staleContexts.push(key);
    }
  }
  contextRef.current = updatedContext;
  return staleContexts;
}

export function useSelectiveContextManager<T>(initialContext: ContextRef<T>) {
  const triggerUpdateRef = useRef({} as UpdateRefInterface<T>);

  const [updatedContext, dispatch] = useReducer(
    DispatchUpdateContextReducer<T>,
    {} as ContextRef<T>
  );
  const contextRef = useRef(updatedContext);

  const completeDispatch = (action: UpdateAction<T>) => {
    const { contextKey, value } = action;
    const currentElement = contextRef.current[contextKey];
    if (currentElement !== value) {
      // dispatch(action);
      // const staleContexts = validateUpdatedContext(contextRef, updatedContext);
      // for (let staleContext of staleContexts) {
      //   const freshContextElement = updatedContext[staleContext];
      const listeners = triggerUpdateRef.current[contextKey];
      if (action.contextKey === 'party-dto-graph-ready')
        console.log('Here it is!', action, listeners);
      try {
        Object.values(listeners).forEach((l) => l(value));
      } catch (e) {
        console.error(e);
      }
      contextRef.current[contextKey] = value;
      // }
    }
  };

  return { dispatch: completeDispatch, triggerUpdateRef, contextRef };
}
