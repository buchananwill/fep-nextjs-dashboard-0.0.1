import { getCurriculumDeliveryModelSchemasByKnowledgeLevel } from '../../../api/actions/curriculum-delivery-model';
import { Card, Title } from '@tremor/react';
import { Pagination } from '../../../components/pagination';
import {
  normalizeQueryParamToNumber,
  oneIndexToZeroIndex,
  zeroIndexToOneIndex
} from '../../../api/utils';
import { CurriculumDeliveryModels } from '../curriculum-delivery-models';
import { UnsavedCurriculumModelChanges } from '../contexts/curriculum-models-context-provider';
import { getWorkTaskTypes } from '../../../api/actions/work-task-types';
import { StringMap } from '../contexts/string-map-context-creator';
import { WorkProjectSeriesSchemaDto } from '../../../api/dtos/WorkProjectSeriesSchemaDtoSchema';
import { WorkTaskTypeInit } from './workTaskTypeInit';
import { CurriculumModelNameListValidator } from './curriculum-model-name-list-validator';

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
  const queryParamToNumber = normalizeQueryParamToNumber(page, 1);
  const indexToZeroIndex = oneIndexToZeroIndex(queryParamToNumber);
  const sizeToNumber = normalizeQueryParamToNumber(size, 8);
  const curriculumDeliveryModelSchemas =
    await getCurriculumDeliveryModelSchemasByKnowledgeLevel(
      indexToZeroIndex,
      sizeToNumber,
      parseInt(yearGroup)
    );

  const taskTypesResponse = await getWorkTaskTypes(2, parseInt(yearGroup));

  const { status, data, message } = curriculumDeliveryModelSchemas;
  const {
    status: taskTypesStatus,
    data: taskTypeList,
    message: taskTypeMessage
  } = taskTypesResponse;
  if (data === undefined || taskTypeList === undefined) {
    return <Card>No schemas found!</Card>;
  }

  const { content, last, first, number, totalPages } = data;
  const pageNumber = zeroIndexToOneIndex(number);

  const stringMap: StringMap<WorkProjectSeriesSchemaDto> = {};
  content.forEach((schema) => {
    stringMap[schema.id] = schema;
  });

  if (status >= 400) {
    return <Card>{message}</Card>;
  }
  return (
    <>
      <WorkTaskTypeInit workTaskTypes={taskTypeList} />
      <div className={'w-full flex items-center gap-2'}>
        <Pagination
          first={first}
          last={last}
          pageNumber={pageNumber}
          unsavedContextKey={UnsavedCurriculumModelChanges}
        />
        <Title>
          Year {yearGroup} - Page {pageNumber} of {totalPages}
        </Title>
      </div>
      <CurriculumDeliveryModels
        yearGroup={parseInt(yearGroup)}
        modelsPayload={content}
      />
    </>
  );
}
