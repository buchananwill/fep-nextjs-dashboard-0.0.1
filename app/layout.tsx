import './globals.css';
import { enableMapSet } from 'immer';
import { Analytics } from '@vercel/analytics/react';
import Nav from './navbar/nav';
import React, { Suspense } from 'react';
import Loading from './generic/components/loading';
import RootProviders from './generic/providers/root-providers';

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
    <html lang="en" className="h-full bg-gray-50">
      <body className="h-full">
        <RootProviders>
          <Suspense>
            <Nav />
          </Suspense>
          <main className="p-4 md:p-10 mx-auto max-w-full">
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </main>
          <Analytics />
          {/*<Toast />*/}
        </RootProviders>
      </body>
    </html>
  );
}
