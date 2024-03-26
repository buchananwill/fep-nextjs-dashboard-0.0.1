import { createContext } from 'react';

export interface KeyListenerContextInterface {
  held: boolean;
}

export const SpaceListener = createContext<boolean>(false);

export const LeftShiftListener = createContext<boolean>(false);
export const LeftCtrlListener = createContext<boolean>(false);
