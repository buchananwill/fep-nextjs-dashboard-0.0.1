import React from 'react';

export const dynamic = 'force-dynamic';

export default async function ElectivesPage({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
