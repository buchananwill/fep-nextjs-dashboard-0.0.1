import { createContext, useContext } from 'react';

export interface StepperInterface {
  increment: () => void;
  decrement: () => void;
  max?: number;
  min?: number;
  current: number;
}

export const StepperContext = createContext<StepperInterface>({
  increment: () => {},
  decrement: () => {},
  max: 1,
  min: 0,
  current: 0
});

export function useStepperContext() {
  return useContext(StepperContext);
}
