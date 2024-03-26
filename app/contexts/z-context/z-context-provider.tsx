'use client';

import { Z_Context, Z_ContextDispatch, Z_INDEX } from './z-context';
import { ReactNode } from 'react';
import { DispatchStateAction } from 'react-day-picker/src/hooks/useControlledValue';

export interface DepthContextProviderProps {
  zIndex: Z_INDEX;
  setZIndex: DispatchStateAction<Z_INDEX>;
}

export default function DepthContextProvider({
  initial: { zIndex, setZIndex },
  children
}: {
  initial: DepthContextProviderProps;
  children: ReactNode;
}) {
  return (
    <Z_Context.Provider value={{ zIndex }}>
      <Z_ContextDispatch.Provider value={{ setZIndex }}>
        {children}
      </Z_ContextDispatch.Provider>
    </Z_Context.Provider>
  );
}
