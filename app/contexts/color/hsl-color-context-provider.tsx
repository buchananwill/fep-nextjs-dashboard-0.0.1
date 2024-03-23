'use client';
import { ReactNode, useState } from 'react';
import {
  HslaColorState,
  HslaColorStateDispatch,
  HslColorContext,
  HslColorDispatchContext
} from './color-context';

export default function HslColorContextProvider({
  children,
  initialState,
  setState
}: {
  children: ReactNode;
  initialState: HslaColorState;
  setState?: HslaColorStateDispatch;
}) {
  const [hslaColorState, setHslaColorState] = useState(initialState);
  const propDisaptch = setState?.setHslaColorState;
  const stateValue = propDisaptch ? initialState : hslaColorState;
  const setStateValue = propDisaptch ? propDisaptch : setHslaColorState;

  return (
    <HslColorContext.Provider value={stateValue}>
      <HslColorDispatchContext.Provider
        value={{ setHslaColorState: setStateValue }}
      >
        {children}
      </HslColorDispatchContext.Provider>
    </HslColorContext.Provider>
  );
}
