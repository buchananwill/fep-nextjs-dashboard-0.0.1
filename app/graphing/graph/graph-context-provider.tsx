'use client';

import { PropsWithChildren } from 'react';
import { GraphContext } from './graph-context-creator';
import { RootSvgContext } from '../root-svg-context';

export default function GraphContextProvider({
  children,
  uniqueGraphName
}: PropsWithChildren & { uniqueGraphName: string }) {
  return (
    <GraphContext.Provider value={{ uniqueGraphName }}>
      <RootSvgContext.Provider value={uniqueGraphName}>
        {children}
      </RootSvgContext.Provider>
    </GraphContext.Provider>
  );
}
