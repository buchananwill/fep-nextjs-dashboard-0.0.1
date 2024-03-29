'use client';
import { ReactNode } from 'react';

import AnimationSyncContextProvider from './contexts/animation-sync-context/animation-sync-context-provider';
import TooltipsContextProvider from './generic/components/tooltips/tooltips-context-provider';
import SelectiveContextCollection from './selective-context/components/selective-context-collection';
import SubjectColorCodingProvider from './contexts/color/subject-color-coding-provider';
import KeyListenerManager from './generic/components/key-listener-context/key-listener-manager';
import ColorCodingProvider from './generic/components/color/color-coding-provider';
import { NextUIProvider } from '@nextui-org/react';

export default function RootProviders({ children }: { children: ReactNode }) {
  return (
    <NextUIProvider>
      <AnimationSyncContextProvider>
        <TooltipsContextProvider startDisabled={true}>
          <SelectiveContextCollection>
            <SubjectColorCodingProvider>
              <KeyListenerManager>
                <ColorCodingProvider>{children}</ColorCodingProvider>
              </KeyListenerManager>
            </SubjectColorCodingProvider>
          </SelectiveContextCollection>
        </TooltipsContextProvider>
      </AnimationSyncContextProvider>
    </NextUIProvider>
  );
}
