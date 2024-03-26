import { createContext } from 'react';
import { StringMap, StringMapDispatch } from './string-map-reducer';

export function createStringMapContext<T>() {
  const mapContext = createContext<StringMap<T>>({});
  const dispatchContext = createContext<StringMapDispatch<T>>(() => {});
  return { mapContext, dispatchContext };
}
