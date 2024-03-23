import { createContext } from 'react';
import {
  StringMap,
  StringMapDispatch
} from '../../curriculum/delivery-models/contexts/string-map-context-creator';

export function createStringMapContext<T>() {
  const mapContext = createContext<StringMap<T>>({});
  const dispatchContext = createContext<StringMapDispatch<T>>(() => {});
  return { mapContext, dispatchContext };
}
