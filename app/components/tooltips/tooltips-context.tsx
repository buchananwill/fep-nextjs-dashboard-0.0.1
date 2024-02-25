import { createContext } from 'react';

export interface TooltipsState {
  showTooltips: boolean;
  setShowTooltips: (value: boolean) => void;
}

export default createContext<TooltipsState>({
  showTooltips: false,
  setShowTooltips: () => {}
});
