import { createContext } from 'react';

export interface ToolCardContext {
  open: boolean;
  toggle: () => void;
}
export const ToolCardContext = createContext<ToolCardContext>({
  open: true,
  toggle: () => {}
});
