import React, { Suspense } from 'react';
import Loading from '../loading';

const dynamic = 'force-dynamic';

export default async function ElectivesPage({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
