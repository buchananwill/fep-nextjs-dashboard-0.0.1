import { Title, Text, Grid, Card } from '@tremor/react';
import ClassRoomCard from './class-room-card';

import { Suspense } from 'react';
import Loading from '../loading';
import { ClassRoomDTO } from '../api/dto-interfaces';
import { fetchPremises } from '../api/actions/request-class-rooms';
import { GraphDto } from '../api/zod-mods';
import { AssetDto } from '../api/dtos/AssetDtoSchema';
import { ActionResponsePromise } from '../api/actions/actionResponse';

export const dynamic = 'force-dynamic';

type ClassRoomsData = ClassRoomDTO[];

export default async function PremisesPage({}: {
  searchParams: { q: string };
}) {
  const premisesPromises: ActionResponsePromise<GraphDto<AssetDto>> =
    fetchPremises();

  const actionResponse = await premisesPromises;

  if (actionResponse.status != 200 || actionResponse.data === undefined) {
    console.log(actionResponse);
    return <Card>No premises!</Card>;
  }

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Premises</Title>
      <Text>
        A list of all the rooms in the school. Total class rooms:{' '}
        <b>{actionResponse.data.nodes.length}</b>
      </Text>
      <Suspense fallback={<Loading />}></Suspense>
    </main>
  );
}
