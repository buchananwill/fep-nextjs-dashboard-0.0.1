import { Card, Title } from '@tremor/react';
import {
  normalizeQueryParamToNumber,
  oneIndexToZeroIndex
} from '../../../api/utils';
import { CurriculumDeliveryModels } from '../curriculum-delivery-models';
import { StringMap } from '../../../contexts/string-map-context/string-map-reducer';
import { WorkProjectSeriesSchemaDto } from '../../../api/dtos/WorkProjectSeriesSchemaDtoSchema';
import { WorkTaskTypeInit } from './workTaskTypeInit';
import { getDtoListByExampleList } from '../../../api/READ-ONLY-generated-actions/WorkTaskType';
import { getDtoListByExampleList as getSchemaListFromExampleList } from '../../../api/READ-ONLY-generated-actions/WorkProjectSeriesSchema';
import { parseTen } from '../../../api/date-and-time';
import { createSchemeExampleListFromWorkTaskTypes } from './bundles/createSchemeExampleListFromWorkTaskTypes';
import { EmptyArray } from '../../../api/main';

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
  const queryParamToNumber = normalizeQueryParamToNumber(page, 1);
  const indexToZeroIndex = oneIndexToZeroIndex(queryParamToNumber);
  const sizeToNumber = normalizeQueryParamToNumber(size, 8);

  const taskTypesResponse = await getDtoListByExampleList([
    {
      knowledgeLevelLevelOrdinal: parseTen(yearGroup)
    }
  ]);

  const schemaExampleList = createSchemeExampleListFromWorkTaskTypes(
    taskTypesResponse.data || EmptyArray
  );

  console.log(schemaExampleList);

  const curriculumDeliveryModelSchemas =
    await getSchemaListFromExampleList(schemaExampleList);
  // await getCurriculumDeliveryModelSchemasByKnowledgeLevel(
  //   indexToZeroIndex,
  //   sizeToNumber,
  //   parseInt(yearGroup)
  // );

  const { data, status, message } = curriculumDeliveryModelSchemas;
  const { data: taskTypeList } = taskTypesResponse;
  if (data === undefined || taskTypeList === undefined) {
    return <Card>No schemas found!</Card>;
  }

  // const { content, last, first, number, totalPages } = data;
  // const pageNumber = zeroIndexToOneIndex(number);

  const stringMap: StringMap<WorkProjectSeriesSchemaDto> = {};
  data.forEach((schema) => {
    stringMap[schema.id] = schema;
  });

  if (status >= 400) {
    return <Card>{message}</Card>;
  }
  return (
    <>
      <WorkTaskTypeInit workTaskTypes={taskTypeList} />
      <div className={'w-full flex items-center gap-2'}>
        {/*<Pagination*/}
        {/*  first={first}*/}
        {/*  last={last}*/}
        {/*  pageNumber={pageNumber}*/}
        {/*  unsavedContextKey={UnsavedCurriculumModelChanges}*/}
        {/*/>*/}
        <Title>
          Year {yearGroup} {/*-Page {pageNumber} of {totalPages}*/}
        </Title>
      </div>
      <CurriculumDeliveryModels
        yearGroup={parseInt(yearGroup)}
        modelsPayload={data}
      />
    </>
  );
}
