'use client';
import { ReactNode } from 'react';

import AnimationSyncContextProvider from '../../contexts/animation-sync-context/animation-sync-context-provider';
import TooltipsContextProvider from '../components/tooltips/tooltips-context-provider';
import SelectiveContextCollection from '../../selective-context/components/selective-context-collection';
import SubjectColorCodingProvider from '../../contexts/color/subject-color-coding-provider';
import KeyListenerManager from '../components/key-listener-context/key-listener-manager';
import ColorCodingProvider from '../components/color/color-coding-provider';
import NextUiProviderWrapper from './next-ui-provider-wrapper';
import SelectiveContextManagerGlobal from '../../selective-context/components/global/selective-context-manager-global';

export default function RootProviders({ children }: { children: ReactNode }) {
  return (
    <SelectiveContextManagerGlobal>
      <NextUiProviderWrapper>
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
      </NextUiProviderWrapper>
    </SelectiveContextManagerGlobal>
  );
}
