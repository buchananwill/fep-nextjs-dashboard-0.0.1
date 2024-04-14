import { Card } from '@nextui-org/card';

import ForceGraphPage from '../../../graphing/force-graph-page';
import { StringMap } from '../../../contexts/string-map-context/string-map-reducer';
import CurriculumDeliveryGraph, {
  CurriculumDeliveryGraphPageKey
} from '../../../graphing/graph-types/organization/curriculum-delivery-graph';
import React from 'react';
import { parseTen } from '../../../api/date-and-time';
import { isNotNull, isNotUndefined } from '../../../api/main';
import { getPage } from '../../../api/READ-ONLY-generated-actions/WorkSeriesSchemaBundle';
import { getDtoListByBodyList } from '../../../api/READ-ONLY-generated-actions/WorkProjectSeriesSchema';
import { getDtoListByBodyList as getWorkTaskTypesByIdList } from '../../../api/READ-ONLY-generated-actions/WorkTaskType';
import {
  getByTypeIdList,
  getGraphByNodeList
} from '../../../api/READ-ONLY-generated-actions/Organization';
import {
  getByRowIdList,
  putList
} from '../../../api/READ-ONLY-generated-actions/WorkSeriesBundleAssignment';
import DtoControllerArray from '../../../selective-context/components/controllers/dto-controller-array';

const emptyBundles = {} as StringMap<string>;

export default async function Page({
  params: { yearGroup }
}: {
  params: {
    yearGroup: string;
  };
}) {
  const typeId = parseTen(yearGroup);
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
  const actionResponse = await getByTypeIdList([typeId]);
  const orgIdList = actionResponse.data?.map((org) => org.id) || [];

  const workTaskTypeIdList =
    allSchemasInBundles.data?.map((schema) => schema.workTaskTypeId) || [];

  const bundleDeliveries = await getByRowIdList(orgIdList);

  const actionResponseOrganizationGraph = await getGraphByNodeList(orgIdList);

  const taskTypesResponse = await getWorkTaskTypesByIdList(workTaskTypeIdList);
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

  const assignmentList = Object.values(assignedBundleDeliveryData)
    .map((list) => (list.length > 0 ? list[0] : null))
    .filter(isNotNull);

  return (
    <>
      <DtoControllerArray
        dtoList={bundleLeanDtos.content}
        entityName={'workSeriesSchemaBundle'}
      />

      <DtoControllerArray
        dtoList={workTaskTypeDtos}
        entityName={'workTaskType'}
      />
      <DtoControllerArray
        dtoList={schemas}
        entityName={'workProjectSeriesSchema'}
      />
      <DtoControllerArray
        dtoList={assignmentList}
        entityName={'workSeriesBundleAssignment'}
        updateServerAction={putList}
      />

      <ForceGraphPage
        dataGraph={dataGraph}
        graphName={CurriculumDeliveryGraphPageKey}
      >
        <CurriculumDeliveryGraph
          bundles={assignmentList}
        ></CurriculumDeliveryGraph>
      </ForceGraphPage>
    </>
  );
}
