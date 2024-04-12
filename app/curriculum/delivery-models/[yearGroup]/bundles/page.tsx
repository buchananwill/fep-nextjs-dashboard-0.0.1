import { getCurriculumDeliveryModelSchemasByKnowledgeLevel } from '../../../../api/actions/custom/work-project-series-schema';
import { normalizeQueryParamToNumber } from '../../../../api/utils';
import { Card } from '@nextui-org/card';
import { BundleEditor } from './bundle-editor';
import { BundleItemsContextProvider } from '../../contexts/bundle-items-context-provider';
import { BundleAssignmentsProvider } from '../../contexts/bundle-assignments-provider';
import { StringMap } from '../../../../contexts/string-map-context/string-map-reducer';
import { CurriculumDeliveryModelsInit } from '../../curriculum-delivery-models-init';
import { getBundlesBySchemaIdList } from '../../../../api/actions/custom/work-series-schema-bundles';
import { getDtoListByExampleList } from '../../../../api/READ-ONLY-generated-actions/WorkTaskType';
import { parseTen } from '../../../../api/date-and-time';

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

  const taskTypesResponse = await getDtoListByExampleList([
    {
      knowledgeLevelLevelOrdinal: parseTen(yearGroup)
    }
  ]);

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
