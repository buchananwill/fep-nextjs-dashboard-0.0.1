import { Card } from '@nextui-org/card';
import { BundleEditor } from './bundle-editor';
import { BundleItemsContextProvider } from '../../contexts/bundle-items-context-provider';
import { BundleAssignmentsProvider } from '../../contexts/bundle-assignments-provider';
import { StringMap } from '../../../../contexts/string-map-context/string-map-reducer';
import { CurriculumDeliveryModelsInit } from '../../curriculum-delivery-models-init';

import { getDtoListByExampleList } from '../../../../api/READ-ONLY-generated-actions/WorkTaskType';
import { getDtoListByExampleList as getBundlesByExampleList } from '../../../../api/READ-ONLY-generated-actions/WorkSeriesSchemaBundle';
import { getDtoListByExampleList as getSchemasByExampleList } from '../../../../api/READ-ONLY-generated-actions/WorkProjectSeriesSchema';
import { parseTen } from '../../../../api/date-and-time';
import { WorkSeriesSchemaBundleLeanDto } from '../../../../api/dtos/WorkSeriesSchemaBundleLeanDtoSchema';
import { ObjectPlaceholder } from '../../../../selective-context/components/typed/selective-context-manager-function';
import { EmptyArray } from '../../../../api/main';
import { WorkTaskTypeDto } from '../../../../api/dtos/WorkTaskTypeDtoSchema';
import { createSchemeExampleListFromWorkTaskTypes } from './createSchemeExampleListFromWorkTaskTypes';

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

  const taskTypesResponse = await getDtoListByExampleList([
    {
      knowledgeLevelLevelOrdinal: parseTen(yearGroup)
    }
  ]);

  const workTaskTypes: WorkTaskTypeDto[] = taskTypesResponse.data || EmptyArray;

  const schemaExampleList =
    createSchemeExampleListFromWorkTaskTypes(workTaskTypes);

  const curriculumDeliveryModelSchemas =
    await getSchemasByExampleList(schemaExampleList);
  // await getCurriculumDeliveryModelSchemasByKnowledgeLevel(
  //   normalizeQueryParamToNumber(page, 0),
  //   normalizeQueryParamToNumber(size, 40),
  //   yearGroupOrdinalInt
  // );

  const { status, data, message } = curriculumDeliveryModelSchemas;
  if (data === undefined) {
    return <Card>No schemas found!</Card>;
  }

  const schemaIdList = data.map((schema) => schema.id);

  const schemasIdsAndNames = data.reduce(
    (prev, curr) => {
      return { ...prev, [curr.id]: curr.name };
    },
    {} as { [key: string]: string }
  );

  const exampleBundle: Partial<WorkSeriesSchemaBundleLeanDto> = {
    workProjectSeriesSchemaIds: schemaIdList
  };

  const actionResponse = await getBundlesByExampleList([exampleBundle]);

  const workTaskTypeDtos = taskTypesResponse.data;
  if (actionResponse.data === undefined || workTaskTypeDtos === undefined) {
    console.log(actionResponse.data, workTaskTypeDtos);
    return <Card>No bundles found!</Card>;
  }

  const bundleLeanDtos = actionResponse.data;

  if (status >= 400) {
    return <Card>{message}</Card>;
  }
  return (
    <BundleItemsContextProvider bundleItems={bundleLeanDtos}>
      <BundleAssignmentsProvider bundleAssignments={ObjectPlaceholder}>
        <CurriculumDeliveryModelsInit
          workProjectSeriesSchemaDtos={
            curriculumDeliveryModelSchemas.data || EmptyArray
          }
          taskTypeList={workTaskTypeDtos}
        />
        <BundleEditor schemaOptions={schemasIdsAndNames} />
      </BundleAssignmentsProvider>
    </BundleItemsContextProvider>
  );
}
