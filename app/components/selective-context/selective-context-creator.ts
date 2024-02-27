import { createContext, Dispatch, MutableRefObject } from 'react';
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
