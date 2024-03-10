import {
  getBundles,
  getBundleDeliveriesByOrgType,
  getSchemasByIdList,
  getOrganizationGraph,
  getOrganizationGraphByOrganizationType
} from '../../api/actions/curriculum-delivery-model';
import { Card } from '@tremor/react';

import ForceGraphPage from '../../graphing/force-graph-page';

import { BundleItemsContextProvider } from '../../curriculum-models/contexts/bundle-items-context-provider';

import { BundleAssignmentsProvider } from '../../curriculum-models/contexts/bundle-assignments-provider';
import { StringMap } from '../../curriculum-models/contexts/string-map-context-creator';
import { getWorkTaskTypes } from '../../api/actions/work-task-types';
import { CurriculumDeliveryModelsInit } from '../../curriculum-models/curriculum-delivery-models-init';

const emptyBundles = {} as StringMap<string>;

export default async function Page({
  params: { yearGroup },
  searchParams
}: {
  params: {
    yearGroup: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { page, size } = searchParams;
  const curriculumDeliveryModelSchemas =
    await getBundleDeliveriesByOrgType(yearGroup);

  const actionResponseOrganizationGraph =
    // await getOrganizationGraphByOrganizationType(yearGroup);
    await getOrganizationGraph();
  const {
    status: statusGraph,
    data: dataGraph,
    message: messageGraph
  } = actionResponseOrganizationGraph;

  const { status, data, message } = curriculumDeliveryModelSchemas;
  if (data === undefined || dataGraph === undefined) {
    return <Card>No deliveries found!</Card>;
  }

  const schemaIdList = data
    .map((delivery) => delivery.workSeriesSchemaBundle)
    .map((bundle) => bundle.workProjectSeriesSchemaIds)
    .reduce((prev, curr) => [...prev, ...curr], []);

  const actionResponseSchemas = await getSchemasByIdList(schemaIdList);

  const schemasIdsAndNames = actionResponseSchemas.data
    ? actionResponseSchemas.data.reduce(
        (prev, curr, currentIndex) => {
          return { ...prev, [curr.id]: curr.name };
        },
        {} as { [key: string]: string }
      )
    : ({} as { [key: string]: string });

  const actionResponse = await getBundles(schemaIdList);

  const indexOfSpace = yearGroup.indexOf('%20');

  const taskTypesResponse = await getWorkTaskTypes(
    2,
    parseInt(yearGroup.substring(indexOfSpace + 3))
  );

  const workTaskTypeDtos = taskTypesResponse.data;
  if (
    actionResponse.data === undefined ||
    workTaskTypeDtos === undefined ||
    actionResponseSchemas.data === undefined
  ) {
    return <Card>No bundles found!</Card>;
  }

  const bundleLeanDtos = actionResponse.data;

  if (status >= 400) {
    return <Card>{message}</Card>;
  }
  return (
    <BundleItemsContextProvider bundleItems={bundleLeanDtos}>
      <BundleAssignmentsProvider bundleAssignments={emptyBundles}>
        <CurriculumDeliveryModelsInit
          workProjectSeriesSchemaDtos={actionResponseSchemas.data}
          taskTypeList={workTaskTypeDtos}
        />

        <ForceGraphPage dataGraph={dataGraph}></ForceGraphPage>
      </BundleAssignmentsProvider>
    </BundleItemsContextProvider>
  );
}
