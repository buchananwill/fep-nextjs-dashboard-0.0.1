import React, { Suspense } from 'react';
import { Text, Title, Card } from '@tremor/react';

// Slug[0] = Year Group

interface Props {
  params: { slug: string[] };
  searchParams: {
    courseId: string;
    carouselId: string;
    partyId: string;
  };
}

const dynamic = 'force-dynamic';

export default async function ElectivesPage({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div className="flex w-full items-center justify-between">
        <Title>Carousel</Title>
        <Text>Carousel Subscription Analysis</Text>
      </div>
      <div className="flex w-full items-top justify-between pt-4">
        <Suspense>{children}</Suspense>
      </div>
    </main>
  );
}
