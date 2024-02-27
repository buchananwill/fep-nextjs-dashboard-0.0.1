import React, {
  createContext,
  Dispatch,
  MutableRefObject,
  useContext,
  useEffect,
  useState
} from 'react';
import {
  ContextRef,
  UpdateAction,
  UpdateRefInterface
} from './selective-context-manager';

export const ContextRefBoolean = createContext<
  MutableRefObject<ContextRef<boolean>>
>({} as MutableRefObject<ContextRef<boolean>>);

export const UpdateRefContextBoolean = createContext<
  MutableRefObject<UpdateRefInterface<boolean>>
>({} as MutableRefObject<UpdateRefInterface<boolean>>);

export const DispatchUpdateContextBoolean = createContext<
  Dispatch<UpdateAction<boolean>>
>(() => {});

export const ContextRefString = createContext<
  MutableRefObject<ContextRef<string>>
>({} as MutableRefObject<ContextRef<string>>);
export const UpdateRefContextString = createContext<
  MutableRefObject<UpdateRefInterface<string>>
>({} as MutableRefObject<UpdateRefInterface<string>>);

export const DispatchUpdateContextString = createContext<
  Dispatch<UpdateAction<string>>
>(() => {});
export const ContextRefStringList = createContext<
  MutableRefObject<ContextRef<string[]>>
>({} as MutableRefObject<ContextRef<string[]>>);
export const UpdateRefContextStringList = createContext<
  MutableRefObject<UpdateRefInterface<string[]>>
>({} as MutableRefObject<UpdateRefInterface<string[]>>);

export const DispatchUpdateContextStringList = createContext<
  Dispatch<UpdateAction<string[]>>
>(() => {});
export const ContextRefNumber = createContext<
  MutableRefObject<ContextRef<number>>
>({} as MutableRefObject<ContextRef<number>>);

export const UpdateRefContextNumber = createContext<
  MutableRefObject<UpdateRefInterface<number>>
>({} as MutableRefObject<UpdateRefInterface<number>>);

export const DispatchUpdateContextNumber = createContext<
  Dispatch<UpdateAction<number>>
>(() => {});

export function useSelectiveContextDispatch<T>(
  contextKey: string,
  initialValue: T,
  UpdateTriggerRefContext: React.Context<
    MutableRefObject<UpdateRefInterface<T>>
  >,
  dispatchUpdateContext: React.Context<(value: UpdateAction<T>) => void>,
  contextRefContext: React.Context<MutableRefObject<ContextRef<T>>>,
  listenerKey?: string
) {
  const mutableRefObject = useContext(UpdateTriggerRefContext);
  const latestRef = useContext(contextRefContext);
  const dispatchUpdate = useContext(dispatchUpdateContext);
  const definedListenerKey = listenerKey ? listenerKey : contextKey;
  const [isInitialized, setIsInitialized] = useState(false);
  const latest = latestRef.current[contextKey];
  const [currentState, setCurrentState] = useState(latest || initialValue);
  const currentElement = mutableRefObject.current[contextKey];
  if (currentElement === undefined) {
    mutableRefObject.current[contextKey] = {};
  }

  useEffect(() => {
    latestRef.current[contextKey] = initialValue;
    dispatchUpdate({ contextKey: contextKey, value: initialValue });
  }, [latestRef, initialValue, dispatchUpdate, contextKey]);

  useEffect(() => {
    if (!isInitialized) {
      Object.values(currentElement).forEach((value) => value(currentState));
      setIsInitialized(true);
      currentElement[definedListenerKey] = setCurrentState;
    }
  }, [currentElement, currentState, isInitialized, definedListenerKey]);
  return { currentState, dispatchUpdate };
}

export function useSelectiveContextListener<T>(
  contextKey: string,
  listenerKey: string,
  updateRefContext: React.Context<
    React.MutableRefObject<UpdateRefInterface<T>>
  >,
  contextRefContext: React.Context<MutableRefObject<ContextRef<T>>>,
  initialState: T
) {
  const mutableRefObject = useContext(updateRefContext);
  const latestRef = useContext(contextRefContext);

  const [currentState, setCurrentState] = useState<T>(
    latestRef.current[contextKey] ?? initialState
  );

  const currentElement = mutableRefObject.current[contextKey];
  if (currentElement === undefined) {
    mutableRefObject.current[contextKey] = {};
  }
  mutableRefObject.current[contextKey][listenerKey] = setCurrentState;

  return { currentState, latestRef, setCurrentState };
}
