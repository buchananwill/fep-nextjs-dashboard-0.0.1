import React, { Suspense } from 'react';
import Loading from '../loading';

export default async function Layout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </main>
  );
}
