import { Card } from '@nextui-org/card';
import { BundleEditor } from './bundle-editor';
import { StringMap } from '../../../../contexts/string-map-context/string-map-reducer';

import { getDtoListByExampleList } from '../../../../api/READ-ONLY-generated-actions/WorkTaskType';
import { getDtoListByExampleList as getBundlesByExampleList } from '../../../../api/READ-ONLY-generated-actions/WorkSeriesSchemaBundle';
import { getDtoListByExampleList as getSchemasByExampleList } from '../../../../api/READ-ONLY-generated-actions/WorkProjectSeriesSchema';
import { parseTen } from '../../../../api/date-and-time';
import { WorkSeriesSchemaBundleLeanDto } from '../../../../api/dtos/WorkSeriesSchemaBundleLeanDtoSchema';
import { EmptyArray } from '../../../../api/main';
import { WorkTaskTypeDto } from '../../../../api/dtos/WorkTaskTypeDtoSchema';
import { createSchemaExampleListFromWorkTaskTypes } from './createSchemaExampleListFromWorkTaskTypes';
import DtoControllerArray from '../../../../selective-context/components/controllers/dto-controller-array';

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
    createSchemaExampleListFromWorkTaskTypes(workTaskTypes);

  const curriculumDeliveryModelSchemas =
    await getSchemasByExampleList(schemaExampleList);

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
    console.error(actionResponse.data, workTaskTypeDtos);
    return <Card>No bundles found!</Card>;
  }

  const bundleLeanDtos = actionResponse.data;

  if (status >= 400) {
    return <Card>{message}</Card>;
  }
  return (
    <>
      <DtoControllerArray
        dtoList={bundleLeanDtos}
        entityName={'workSeriesSchemaBundle'}
      />
      <DtoControllerArray
        dtoList={data}
        entityName={'workProjectSeriesSchema'}
      />
      <DtoControllerArray
        dtoList={workTaskTypeDtos}
        entityName={'workTaskTypes'}
      />
      <BundleEditor schemaOptions={schemasIdsAndNames} />
    </>
  );
}
