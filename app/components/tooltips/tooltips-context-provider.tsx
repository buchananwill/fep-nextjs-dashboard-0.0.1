'use client';
import { ReactNode, useContext, useState } from 'react';
import TooltipsContext, { TooltipsState } from './tooltips-context';

export default function TooltipsContextProvider({
  children,
  disabled
}: {
  children: ReactNode;
  disabled?: boolean;
}) {
  const enabled = !disabled;

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
