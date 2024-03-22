'use client';

import { RunnableContext } from './runnable-context';
import { ReactNode } from 'react';

export default function RunnableContextProvider({
  context,
  children
}: {
  children: ReactNode;
  context: RunnableContext;
}) {
  return (
    <RunnableContext.Provider value={context}>
      {children}
    </RunnableContext.Provider>
  );
}
