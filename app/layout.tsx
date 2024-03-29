import './globals.css';
import { enableMapSet } from 'immer';
import { Analytics } from '@vercel/analytics/react';
import Nav from './navbar/nav';
import React, { Suspense } from 'react';
import Loading from './loading';
import TooltipsContextProvider from './generic/components/tooltips/tooltips-context-provider';
import SubjectColorCodingProvider from './contexts/color/subject-color-coding-provider';

import AnimationSyncContextProvider from './contexts/animation-sync-context/animation-sync-context-provider';
import ColorCodingProvider from './generic/components/color/color-coding-provider';
import SelectiveContextCollection from './selective-context/components/selective-context-collection';
import KeyListenerManager from './generic/components/key-listener-context/key-listener-manager';

enableMapSet();

export const metadata = {
  title: 'FEP Academic Scheduling UI',
  description:
    'An academic scheduling UI configured with Next.js, NextAuth, Tailwind CSS, TypeScript, ESLint, and Prettier.'
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-50" data-theme={'light'}>
      <body className="h-full">
        <AnimationSyncContextProvider>
          <TooltipsContextProvider startDisabled={true}>
            <SelectiveContextCollection>
              <SubjectColorCodingProvider>
                <KeyListenerManager>
                  <ColorCodingProvider>
                    <Suspense>
                      <Nav />
                    </Suspense>
                    <main className="p-4 md:p-10 mx-auto max-w-full">
                      <Suspense fallback={<Loading />}>{children}</Suspense>
                    </main>
                    <Analytics />
                  </ColorCodingProvider>
                  {/*<Toast />*/}
                </KeyListenerManager>
              </SubjectColorCodingProvider>
            </SelectiveContextCollection>
          </TooltipsContextProvider>
        </AnimationSyncContextProvider>
      </body>
    </html>
  );
}
