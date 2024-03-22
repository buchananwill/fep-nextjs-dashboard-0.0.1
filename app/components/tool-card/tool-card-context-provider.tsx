'use client';

import React, { ReactNode, useState } from 'react';
import { ToolCardContext } from './tool-card-context';

export default function ToolCardContextProvider({
  children
}: {
  children: ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const toggle = () => {
    setOpen(!open);
  };

  return (
    <ToolCardContext.Provider value={{ open: open, toggle: toggle }}>
      <div className={`mr-2`} style={{ width: `${open ? '25%' : '10%'}` }}>
        {children}
      </div>
    </ToolCardContext.Provider>
  );
}
