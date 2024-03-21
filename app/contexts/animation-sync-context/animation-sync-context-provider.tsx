'use client';
import { PropsWithChildren } from 'react';
import {
  AnimationSyncContext,
  createSineLut
} from './animation-sync-context-creator';

export default function AnimationSyncContextProvider({
  children
}: PropsWithChildren) {
  return (
    <AnimationSyncContext.Provider value={{ sineLut: createSineLut() }}>
      {children}
    </AnimationSyncContext.Provider>
  );
}
