import React, { Suspense } from 'react';
import { Text, Title } from '@tremor/react';
import ToolTipsToggle from './tool-tips-toggle';

import { RefreshButton } from '../components/refresh-button';
import CommitChanges from './commit-changes';
import ElectivesContextProvider from './elective-context-provider';

const dynamic = 'force-dynamic';

export default async function ElectivesPage({
  children
}: {
  children: React.ReactNode;
}) {
  return <main className="p-4 md:p-10 mx-auto max-w-7xl">{children}</main>;
}
