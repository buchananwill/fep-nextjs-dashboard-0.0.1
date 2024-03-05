import { getCurriculumDeliveryModelSchemasByKnowledgeLevel } from '../../api/actions/curriculum-delivery-model';
import { Card, Grid, Title } from '@tremor/react';
import BoxHierarchies from '../../playground/box-hierarchies';
import { CurriculumDeliveryModel } from '../curriculum-delivery-model';
import ForceGraphPage from '../../graphing/force-graph-page';
import { Pagination } from '../../components/pagination';
import { normalizeQueryParamToNumber } from '../../api/utils';
import { CurriculumDeliveryModels } from '../curriculum-delivery-models';
import { UnsavedCurriculumModelChanges } from '../contexts/curriculum-models-context-provider';
import { getWorkTaskTypes } from '../../api/actions/work-task-types';

export function oneIndexToZeroIndex(index: number) {
  return Math.max(index - 1, 0);
}
export function zeroIndexToOneIndex(
  index: number,
  array?: [],
  totalPages?: number
) {
  const unsafeValue = index + 1;
  if (array) {
    return Math.min(unsafeValue, array.length);
  } else if (totalPages) {
    return Math.min(unsafeValue, totalPages);
  }
  return unsafeValue;
}

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
  const curriculumDeliveryModelSchemas =
    await getCurriculumDeliveryModelSchemasByKnowledgeLevel(
      parseInt(yearGroup),
      oneIndexToZeroIndex(normalizeQueryParamToNumber(page, 1)),
      normalizeQueryParamToNumber(size, 11)
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
