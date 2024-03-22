import { createContext } from 'react';

export interface HoverWidthContext {
  isWide: boolean;
  toggle: () => void;
}

const defaultContext: HoverWidthContext = {
  isWide: false,
  toggle: () => {}
};
export const HoverWidthContext =
  createContext<HoverWidthContext>(defaultContext);
