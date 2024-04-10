import { getCurriculumDeliveryModelSchemasByKnowledgeLevel } from '../../../../api/actions/curriculum-delivery-model';
import { normalizeQueryParamToNumber } from '../../../../api/utils';
import { Card } from '@nextui-org/card';
import { BundleEditor } from './bundle-editor';
import { BundleItemsContextProvider } from '../../contexts/bundle-items-context-provider';
import { BundleAssignmentsProvider } from '../../contexts/bundle-assignments-provider';
import { StringMap } from '../../../../contexts/string-map-context/string-map-reducer';
import { getWorkTaskTypes } from '../../../../api/actions/work-task-types';
import { CurriculumDeliveryModelsInit } from '../../curriculum-delivery-models-init';
import { getBundlesBySchemaIdList } from '../../../../api/actions/work-series-schema-bundles';

const emptyBundles = {} as StringMap<string>;

export default async function Page({
  params: { yearGroup },
  searchParams
}: {
  params: {
    yearGroup: string;
  };
  searchParams: StringMap<string | string[] | undefined>;
}) {
  const { page, size } = searchParams;
  const curriculumDeliveryModelSchemas =
    await getCurriculumDeliveryModelSchemasByKnowledgeLevel(
      normalizeQueryParamToNumber(page, 0),
      normalizeQueryParamToNumber(size, 40),
      parseInt(yearGroup)
    );

  const { status, data, message } = curriculumDeliveryModelSchemas;
  if (data === undefined) {
    return <Card>No schemas found!</Card>;
  }

  const schemaIdList = data.content.map((schema) => schema.id);

  const schemasIdsAndNames = data.content.reduce(
    (prev, curr) => {
      return { ...prev, [curr.id]: curr.name };
    },
    {} as { [key: string]: string }
  );

  const actionResponse = await getBundlesBySchemaIdList(schemaIdList);

  const taskTypesResponse = await getWorkTaskTypes({
    knowledgeLevelOrdinal: yearGroup
  });

  const workTaskTypeDtos = taskTypesResponse.data;
  if (actionResponse.data === undefined || workTaskTypeDtos === undefined) {
    console.log(actionResponse.data, workTaskTypeDtos);
    return <Card>No bundles found!</Card>;
  }

  const { content } = data;

  const bundleLeanDtos = actionResponse.data;

  if (status >= 400) {
    return <Card>{message}</Card>;
  }
  return (
    <BundleItemsContextProvider bundleItems={bundleLeanDtos}>
      <BundleAssignmentsProvider bundleAssignments={emptyBundles}>
        <CurriculumDeliveryModelsInit
          workProjectSeriesSchemaDtos={content}
          taskTypeList={workTaskTypeDtos}
        />
        <BundleEditor schemaOptions={schemasIdsAndNames} />
      </BundleAssignmentsProvider>
    </BundleItemsContextProvider>
  );
}
