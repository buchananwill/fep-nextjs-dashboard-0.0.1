import { createContext, Dispatch, MutableRefObject } from 'react';
import {
  LatestValueRef,
  UpdateAction,
  ListenerRefInterface
} from '../../generic/components/selective-context/selective-context-manager';
import { GenericFunctionWrapper } from '../../generic/components/selective-context/selective-context-manager-function';

export const ContextRefBoolean = createContext<
  MutableRefObject<LatestValueRef<boolean>>
>({} as MutableRefObject<LatestValueRef<boolean>>);

export const UpdateRefContextBoolean = createContext<
  MutableRefObject<ListenerRefInterface<boolean>>
>({} as MutableRefObject<ListenerRefInterface<boolean>>);

export const DispatchUpdateContextBoolean = createContext<
  Dispatch<UpdateAction<boolean>>
>(() => {});

export const ContextRefString = createContext<
  MutableRefObject<LatestValueRef<string>>
>({} as MutableRefObject<LatestValueRef<string>>);
export const UpdateRefContextString = createContext<
  MutableRefObject<ListenerRefInterface<string>>
>({} as MutableRefObject<ListenerRefInterface<string>>);

export const DispatchUpdateContextString = createContext<
  Dispatch<UpdateAction<string>>
>(() => {});
export const ContextRefStringList = createContext<
  MutableRefObject<LatestValueRef<string[]>>
>({} as MutableRefObject<LatestValueRef<string[]>>);
export const UpdateRefContextStringList = createContext<
  MutableRefObject<ListenerRefInterface<string[]>>
>({} as MutableRefObject<ListenerRefInterface<string[]>>);

export const DispatchUpdateContextStringList = createContext<
  Dispatch<UpdateAction<string[]>>
>(() => {});
export const ContextRefNumberList = createContext<
  MutableRefObject<LatestValueRef<number[]>>
>({} as MutableRefObject<LatestValueRef<number[]>>);
export const UpdateRefContextNumberList = createContext<
  MutableRefObject<ListenerRefInterface<number[]>>
>({} as MutableRefObject<ListenerRefInterface<number[]>>);

export const DispatchUpdateContextNumberList = createContext<
  Dispatch<UpdateAction<number[]>>
>(() => {});
export const ContextRefNumber = createContext<
  MutableRefObject<LatestValueRef<number>>
>({} as MutableRefObject<LatestValueRef<number>>);

export const UpdateRefContextNumber = createContext<
  MutableRefObject<ListenerRefInterface<number>>
>({} as MutableRefObject<ListenerRefInterface<number>>);

export const DispatchUpdateContextNumber = createContext<
  Dispatch<UpdateAction<number>>
>(() => {});

export type GenericFunction<T, U> = (arg: T) => U;

export const ContextRefFunction = createContext<
  MutableRefObject<LatestValueRef<GenericFunctionWrapper<any, any>>>
>({} as MutableRefObject<LatestValueRef<GenericFunctionWrapper<any, any>>>);

export const UpdateRefContextFunction = createContext<
  MutableRefObject<ListenerRefInterface<GenericFunctionWrapper<any, any>>>
>(
  {} as MutableRefObject<ListenerRefInterface<GenericFunctionWrapper<any, any>>>
);

export const DispatchUpdateContextFunction = createContext<
  Dispatch<UpdateAction<GenericFunctionWrapper<any, any>>>
>(() => {});
