import { createContext } from 'react';

export interface RunnableContext {
  callback: () => void;
}

export const RunnableContext = createContext<RunnableContext>({
  callback: () => {}
});
