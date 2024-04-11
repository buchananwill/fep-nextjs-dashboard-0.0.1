import { Card } from '@nextui-org/card';

import ForceGraphPage from '../../../graphing/force-graph-page';

import { BundleItemsContextProvider } from '../../delivery-models/contexts/bundle-items-context-provider';

import { BundleAssignmentsProvider } from '../../delivery-models/contexts/bundle-assignments-provider';
import { StringMap } from '../../../contexts/string-map-context/string-map-reducer';
import { getWorkTaskTypesByWorkProjectSeriesSchemaIdList } from '../../../api/actions/work-task-types';
import { CurriculumDeliveryModelsInit } from '../../delivery-models/curriculum-delivery-models-init';
import CurriculumDeliveryGraph, {
  CurriculumDeliveryGraphPageKey
} from '../../../graphing/graph-types/organization/curriculum-delivery-graph';
import React from 'react';
import { getBundleAssignmentsByOrgType } from '../../../api/actions/work-series-bundle-assignments';
import { getOrganizationGraphByOrganizationType } from '../../../api/actions/organizations';
import { parseTen } from '../../../api/date-and-time';
import { isNotUndefined } from '../../../api/main';
import { getPage } from '../../../api/READ-ONLY-generated-actions/WorkSeriesSchemaBundle';
import { getDtoListByBodyList } from '../../../api/READ-ONLY-generated-actions/WorkProjectSeriesSchema';

const emptyBundles = {} as StringMap<string>;

export default async function Page({
  params: { yearGroup }
}: {
  params: {
    yearGroup: string;
  };
}) {
  const actionResponseAllBundles = await getPage({ pageSize: 100 });

  const schemaIdList = actionResponseAllBundles.data?.content
    .map((bundle) => bundle.workProjectSeriesSchemaIds)
    .reduce((prev, curr) => {
      if (Array.isArray(curr)) return [...prev, ...curr];
      else return [...prev, curr];
    }, []);

  const schemaIdListFromSet = isNotUndefined(schemaIdList)
    ? [...new Set(schemaIdList)]
    : ([] as string[]);

  const allSchemasInBundles = await getDtoListByBodyList(schemaIdListFromSet);

  const typeId = parseTen(yearGroup);
  const bundleDeliveries = await getBundleAssignmentsByOrgType(typeId);
  bundleDeliveries.data
    ?.map((data) => data.workSeriesSchemaBundle.workProjectSeriesSchemaIds)
    .reduce((previousValue, curr) => {
      curr.forEach((id) => previousValue.add(id));
      return previousValue;
    }, new Set<string>());
  const actionResponseOrganizationGraph =
    await getOrganizationGraphByOrganizationType(typeId);
  // await getOrganizationGraph();
  // await getOrganizationGraphByRootId(1446);

  const taskTypesResponse =
    await getWorkTaskTypesByWorkProjectSeriesSchemaIdList(schemaIdListFromSet);
  const workTaskTypeDtos = taskTypesResponse.data;

  const { data: dataGraph } = actionResponseOrganizationGraph;

  const {
    status,
    data: assignedBundleDeliveryData,
    message
  } = bundleDeliveries;

  if (assignedBundleDeliveryData === undefined) {
    return <Card>No deliveries found!</Card>;
  } else if (workTaskTypeDtos === undefined) {
    return <Card>No task types found!</Card>;
  }
  if (dataGraph === undefined) {
    return <Card>No organization graph found!</Card>;
  }

  if (
    actionResponseAllBundles.data === undefined ||
    allSchemasInBundles.data === undefined
  ) {
    return <Card>No bundles found!</Card>;
  }

  const bundleLeanDtos = actionResponseAllBundles.data;
  const schemas = allSchemasInBundles.data;

  if (status >= 400) {
    return <Card>{message}</Card>;
  }

  return (
    <BundleItemsContextProvider bundleItems={bundleLeanDtos.content}>
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
