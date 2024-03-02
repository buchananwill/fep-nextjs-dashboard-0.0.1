import { getCurriculumDeliveryModelSchemas } from '../../api/actions/curriculum-delivery-model';
import { Card, Grid, Title } from '@tremor/react';
import BoxHierarchies from '../../playground/box-hierarchies';
import { CurriculumDeliveryModel } from '../curriculum-delivery-model';
import ForceGraphPage from '../../graphing/force-graph-page';
import { Pagination } from '../../components/pagination';
import { normalizeQueryParamToNumber } from '../../api/utils';
import { CurriculumDeliveryModels } from './bundles/curriculum-delivery-models';
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
  const curriculumDeliveryModelSchemas =
    await getCurriculumDeliveryModelSchemas(
      parseInt(yearGroup),
      normalizeQueryParamToNumber(page, 0),
      normalizeQueryParamToNumber(size, 7)
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

  if (status >= 400) {
    return <Card>{message}</Card>;
  }
  return (
    <>
      <div className={'w-full flex items-center gap-2'}>
        <Pagination
          first={first}
          last={last}
          pageNumber={number}
          unsavedContextKey={UnsavedCurriculumModelChanges}
        />
        <Title>
          Year {yearGroup} - Page {number + 1} of {totalPages}
        </Title>
      </div>
      <CurriculumDeliveryModels
        workProjectSeriesSchemaDtos={content}
        taskTypeList={taskTypeList}
      />
      <BoxHierarchies></BoxHierarchies>
    </>
  );
}
