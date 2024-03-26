'use client';
import { ReactNode, useContext, useState } from 'react';
import TooltipsContext, { TooltipsState } from './tooltips-context';

export default function TooltipsContextProvider({
  children,
  startDisabled
}: {
  children: ReactNode;
  startDisabled?: boolean;
}) {
  const enabled = !startDisabled;

  const [showTooltips, setShowTooltips] = useState(enabled);

  const contextValue: TooltipsState = {
    showTooltips: showTooltips,
    setShowTooltips: (value: boolean) => {
      setShowTooltips(value);
    }
  };

  return (
    <TooltipsContext.Provider value={contextValue}>
      {children}
    </TooltipsContext.Provider>
  );
}

export function useTooltipsContext() {
  return useContext(TooltipsContext);
}
