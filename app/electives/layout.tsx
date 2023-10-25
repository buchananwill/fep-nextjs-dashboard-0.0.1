import React, { Suspense } from 'react';
import { Text, Title } from '@tremor/react';
import ToolTipsToggle from './tool-tips-toggle';
import { NavigationEvents } from './navigation-events';

const dynamic = 'force-dynamic';

export default async function ElectivesPage({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div className="flex w-full items-baseline grow-0">
        <Title>Option Blocks</Title>
        <Text className="mx-2">Subscription Analysis</Text>
        <span className="grow"></span>
        <ToolTipsToggle></ToolTipsToggle>
      </div>
      <div className="flex w-full items-top justify-between pt-4">
        <Suspense>
          <NavigationEvents />
          {children}
        </Suspense>
      </div>
    </main>
  );
}
