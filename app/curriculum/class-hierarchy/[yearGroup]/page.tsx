import {
  getBundleDeliveriesByOrgType,
  getBundles,
  getOrganizationGraphByOrganizationType,
  getSchemasByIdList
} from '../../../api/actions/curriculum-delivery-model';
import { Card } from '@tremor/react';

import ForceGraphPage from '../../../graphing/force-graph-page';

import { BundleItemsContextProvider } from '../../delivery-models/contexts/bundle-items-context-provider';

import { BundleAssignmentsProvider } from '../../delivery-models/contexts/bundle-assignments-provider';
import { StringMap } from '../../../contexts/string-map-context/string-map-reducer';
import { getWorkTaskTypes } from '../../../api/actions/work-task-types';
import { CurriculumDeliveryModelsInit } from '../../delivery-models/curriculum-delivery-models-init';
import CurriculumDeliveryGraph, {
  CurriculumDeliveryGraphPageKey
} from '../../../graphing/graph-types/organization/curriculum-delivery-graph';
import React from 'react';

const emptyBundles = {} as StringMap<string>;

export default async function Page({
  params: { yearGroup }
}: {
  params: {
    yearGroup: string;
  };
}) {
  // await getOrganizationGraph();
  const bundleDeliveries = await getBundleDeliveriesByOrgType(yearGroup);
  const actionResponseOrganizationGraph =
    await getOrganizationGraphByOrganizationType(yearGroup);

  const indexOfSpace = yearGroup.indexOf('%20');
  const taskTypesResponse = await getWorkTaskTypes(
    2,
    parseInt(yearGroup.substring(indexOfSpace + 3))
  );
  const workTaskTypeDtos = taskTypesResponse.data;

  const { data: dataGraph } = actionResponseOrganizationGraph;

  const {
    status,
    data: assignedBundleDeliveryData,
    message
  } = bundleDeliveries;

  if (
    workTaskTypeDtos === undefined ||
    assignedBundleDeliveryData === undefined ||
    dataGraph === undefined
  ) {
    return <Card>No deliveries found!</Card>;
  }

  const schemaIdList = assignedBundleDeliveryData
    .map((delivery) => delivery.workSeriesSchemaBundle)
    .map((bundle) => bundle.workProjectSeriesSchemaIds)
    .reduce((prev, curr) => [...prev, ...curr], []);

  const actionResponseSchemasInTheAssignedDeliveries =
    await getSchemasByIdList(schemaIdList);

  const actionResponseAllBundles = await getBundles(schemaIdList);

  if (
    actionResponseAllBundles.data === undefined ||
    actionResponseSchemasInTheAssignedDeliveries.data === undefined
  ) {
    return <Card>No bundles found!</Card>;
  }

  const bundleLeanDtos = actionResponseAllBundles.data;
  const schemas = actionResponseSchemasInTheAssignedDeliveries.data;

  if (status >= 400) {
    return <Card>{message}</Card>;
  }

  return (
    <BundleItemsContextProvider bundleItems={bundleLeanDtos}>
      <BundleAssignmentsProvider bundleAssignments={emptyBundles}>
        <CurriculumDeliveryModelsInit
          workProjectSeriesSchemaDtos={schemas}
          taskTypeList={workTaskTypeDtos}
        />

        <ForceGraphPage
          dataGraph={dataGraph}
          graphName={CurriculumDeliveryGraphPageKey}
        >
          <CurriculumDeliveryGraph
            bundles={assignedBundleDeliveryData}
          ></CurriculumDeliveryGraph>
        </ForceGraphPage>
      </BundleAssignmentsProvider>
    </BundleItemsContextProvider>
  );
}
