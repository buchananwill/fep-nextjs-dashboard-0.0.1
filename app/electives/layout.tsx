import React, { Suspense } from 'react';
import { Text, Title, Card } from '@tremor/react';
import ToolTipsToggle from './tool-tips-toggle';
import { useRouter } from 'next/navigation';

// Slug[0] = Year Group

interface Props {
  params: { slug: string[] };
  searchParams: {
    courseId: string;
    carouselId: string;
    partyId: string;
    toolTips: string;
  };
  children: React.ReactNode;
}

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
        <Suspense>{children}</Suspense>
      </div>
    </main>
  );
}
