import { createContext, Dispatch, SetStateAction } from 'react';

export interface TooltipsState {
  showTooltips: boolean;
  setShowTooltips: Dispatch<SetStateAction<boolean>>;
}

export default createContext<TooltipsState>({
  showTooltips: false,
  setShowTooltips: () => {}
});
