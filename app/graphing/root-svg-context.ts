import { createContext, useContext } from 'react';

export const RootSvgContext = createContext<string>('');

export function useRootSvgContext() {
  return useContext(RootSvgContext);
}
