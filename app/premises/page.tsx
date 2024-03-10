import { Title, Text, Grid, Card } from '@tremor/react';
import ClassRoomCard from './class-room-card';

import { Suspense } from 'react';
import Loading from '../loading';
import { ClassRoomDTO } from '../api/dto-interfaces';
import { fetchPremises } from '../api/actions/request-class-rooms';
import { GraphDto } from '../api/zod-mods';
import { AssetDto } from '../api/dtos/AssetDtoSchema';
import { ActionResponsePromise } from '../api/actions/actionResponse';
import ForceGraphPage from '../graphing/force-graph-page';
import { PremisesHierarchyGraph } from './premises-hierarchy-graph';

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

  const { data: graphDto } = actionResponse;

  return (
    <>
      <Title>Premises</Title>
      <ForceGraphPage dataGraph={graphDto} graphName={'premises-graph'}>
        <PremisesHierarchyGraph />
      </ForceGraphPage>
    </>
  );
}
