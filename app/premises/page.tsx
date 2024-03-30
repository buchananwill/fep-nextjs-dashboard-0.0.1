import { Title, Card } from '@tremor/react';

import { getPremises } from '../api/actions/premises';
import { GraphDto } from '../api/zod-mods';
import { AssetDto } from '../api/dtos/AssetDtoSchema';
import { ActionResponsePromise } from '../api/actions/actionResponse';
import ForceGraphPage, { NodePayload } from '../graphing/force-graph-page';
import { PremisesHierarchyGraph } from './premises-hierarchy-graph';
import { OrganizationDto } from '../api/dtos/OrganizationDtoSchema';
import CurriculumDeliveryDetails from '../graphing/graph-types/organization/curriculum-delivery-details';
import React from 'react';
import PremisesDetails from './premises-details';

export const dynamic = 'force-dynamic';

export default async function PremisesPage({}: {
  searchParams: { q: string };
}) {
  const premisesPromises: ActionResponsePromise<GraphDto<AssetDto>> =
    getPremises();

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
