import { createContext, Dispatch, MutableRefObject } from 'react';
import {
  LatestValueRef,
  UpdateAction,
  UpdateRefInterface
} from './selective-context-manager';
import { GenericFunctionWrapper } from './selective-context-manager-function';

export const ContextRefBoolean = createContext<
  MutableRefObject<LatestValueRef<boolean>>
>({} as MutableRefObject<LatestValueRef<boolean>>);

export const UpdateRefContextBoolean = createContext<
  MutableRefObject<UpdateRefInterface<boolean>>
>({} as MutableRefObject<UpdateRefInterface<boolean>>);

export const DispatchUpdateContextBoolean = createContext<
  Dispatch<UpdateAction<boolean>>
>(() => {});

export const ContextRefString = createContext<
  MutableRefObject<LatestValueRef<string>>
>({} as MutableRefObject<LatestValueRef<string>>);
export const UpdateRefContextString = createContext<
  MutableRefObject<UpdateRefInterface<string>>
>({} as MutableRefObject<UpdateRefInterface<string>>);

export const DispatchUpdateContextString = createContext<
  Dispatch<UpdateAction<string>>
>(() => {});
export const ContextRefStringList = createContext<
  MutableRefObject<LatestValueRef<string[]>>
>({} as MutableRefObject<LatestValueRef<string[]>>);
export const UpdateRefContextStringList = createContext<
  MutableRefObject<UpdateRefInterface<string[]>>
>({} as MutableRefObject<UpdateRefInterface<string[]>>);

export const DispatchUpdateContextStringList = createContext<
  Dispatch<UpdateAction<string[]>>
>(() => {});
export const ContextRefNumberList = createContext<
  MutableRefObject<LatestValueRef<number[]>>
>({} as MutableRefObject<LatestValueRef<number[]>>);
export const UpdateRefContextNumberList = createContext<
  MutableRefObject<UpdateRefInterface<number[]>>
>({} as MutableRefObject<UpdateRefInterface<number[]>>);

export const DispatchUpdateContextNumberList = createContext<
  Dispatch<UpdateAction<number[]>>
>(() => {});
export const ContextRefNumber = createContext<
  MutableRefObject<LatestValueRef<number>>
>({} as MutableRefObject<LatestValueRef<number>>);

export const UpdateRefContextNumber = createContext<
  MutableRefObject<UpdateRefInterface<number>>
>({} as MutableRefObject<UpdateRefInterface<number>>);

export const DispatchUpdateContextNumber = createContext<
  Dispatch<UpdateAction<number>>
>(() => {});

export type GenericFunction<T, U> = (arg: T) => U;

export const ContextRefFunction = createContext<
  MutableRefObject<LatestValueRef<GenericFunctionWrapper<any, any>>>
>({} as MutableRefObject<LatestValueRef<GenericFunctionWrapper<any, any>>>);

export const UpdateRefContextFunction = createContext<
  MutableRefObject<UpdateRefInterface<GenericFunctionWrapper<any, any>>>
>({} as MutableRefObject<UpdateRefInterface<GenericFunctionWrapper<any, any>>>);

export const DispatchUpdateContextFunction = createContext<
  Dispatch<UpdateAction<GenericFunctionWrapper<any, any>>>
>(() => {});
