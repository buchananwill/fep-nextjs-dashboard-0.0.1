import { Card, Title } from '@tremor/react';
import { GraphDto } from '../api/zod-mods';
import { AssetDto } from '../api/dtos/AssetDtoSchema';
import { ActionResponsePromise } from '../api/actions/actionResponse';
import ForceGraphPage from '../graphing/force-graph-page';
import { PremisesHierarchyGraph } from './premises-hierarchy-graph';
import React from 'react';
import { getGraph } from '../api/READ-ONLY-generated-actions/Asset';

export const dynamic = 'force-dynamic';

export default async function PremisesPage({}: {
  searchParams: { q: string };
}) {
  const premisesPromises: ActionResponsePromise<GraphDto<AssetDto>> =
    getGraph();

  const actionResponse = await premisesPromises;

  if (actionResponse.status != 200 || actionResponse.data === undefined) {
    console.log('Not implemented', actionResponse);
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
