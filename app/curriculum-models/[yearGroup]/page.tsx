import { getCurriculumDeliveryModelSchemasByKnowledgeLevel } from '../../api/actions/curriculum-delivery-model';
import { Card, Title } from '@tremor/react';
import { Pagination } from '../../components/pagination';
import {
  normalizeQueryParamToNumber,
  oneIndexToZeroIndex,
  zeroIndexToOneIndex
} from '../../api/utils';
import { CurriculumDeliveryModels } from '../curriculum-delivery-models';
import { UnsavedCurriculumModelChanges } from '../contexts/curriculum-models-context-provider';
import { getWorkTaskTypes } from '../../api/actions/work-task-types';

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
  const sizeToNumber = normalizeQueryParamToNumber(size, 11);
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

  if (status >= 400) {
    return <Card>{message}</Card>;
  }
  return (
    <>
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
        workProjectSeriesSchemaDtos={content}
        taskTypeList={taskTypeList}
        yearGroup={parseInt(yearGroup)}
      />
    </>
  );
}
