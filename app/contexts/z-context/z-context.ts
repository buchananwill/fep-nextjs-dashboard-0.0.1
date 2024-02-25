import { DispatchStateAction } from 'react-day-picker/src/hooks/useControlledValue';
import { createContext, Dispatch, SetStateAction } from 'react';

export type Z_INDEX = 'z-0' | 'z-10' | 'z-20' | 'z-30' | 'z-40' | 'z-50';

export interface Z_State {
  zIndex: Z_INDEX;
}

export interface Z_Dispatch {
  setZIndex: Dispatch<Z_INDEX>;
}

export const Z_Context = createContext<Z_State>({ zIndex: 'z-0' });

export const Z_ContextDispatch = createContext<Z_Dispatch>({
  setZIndex: (value: Z_INDEX) => {}
});
