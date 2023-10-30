import React, { Suspense } from 'react';
import Loading from '../loading';

const dynamic = 'force-dynamic';

export default async function ElectivesPage({
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
