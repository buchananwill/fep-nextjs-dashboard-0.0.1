import { Card, Grid, Title } from '@tremor/react';
import { getDtoListByExampleList } from '../../../api/READ-ONLY-generated-actions/WorkTaskType';
import {
  deleteIdList,
  getDtoListByExampleList as getSchemaListFromExampleList,
  putList
} from '../../../api/READ-ONLY-generated-actions/WorkProjectSeriesSchema';
import { parseTen } from '../../../api/date-and-time';
import { createSchemeExampleListFromWorkTaskTypes } from './bundles/createSchemeExampleListFromWorkTaskTypes';
import { CurriculumModelNameListValidator } from './curriculum-model-name-list-validator';
import React from 'react';
import { AddNewCurriculumModelCard } from '../add-new-curriculum-model-card';
import DtoControllerArray from '../../../selective-context/components/controllers/dto-controller-array';
import SchemaArrayWrapper from './schema-array-wrapper';
import { DataNotFoundCard } from '../../../timetables/students/[schedule]/data-not-found-card';

export default async function Page({
  params: { yearGroup }
}: {
  params: {
    yearGroup: string;
  };
}) {
  const taskTypesResponse = await getDtoListByExampleList([
    {
      knowledgeLevelLevelOrdinal: parseTen(yearGroup)
    }
  ]);

  if (taskTypesResponse.data === undefined) {
    console.error(taskTypesResponse.message);
    return <DataNotFoundCard>Lesson Types Empty!</DataNotFoundCard>;
  }

  const schemaExampleList = createSchemeExampleListFromWorkTaskTypes(
    taskTypesResponse.data
  );

  console.log(schemaExampleList);

  const curriculumDeliveryModelSchemas =
    await getSchemaListFromExampleList(schemaExampleList);

  const {
    data: workProjectSeriesSchemaList,
    status,
    message
  } = curriculumDeliveryModelSchemas;
  const { data: taskTypeList } = taskTypesResponse;
  if (workProjectSeriesSchemaList === undefined) {
    return <Card>No schemas found!</Card>;
  }

  console.log(taskTypesResponse.data.length);
  console.log(workProjectSeriesSchemaList.length);

  if (status >= 400) {
    return <Card>{message}</Card>;
  }
  return (
    <>
      <CurriculumModelNameListValidator>
        <DtoControllerArray
          dtoList={taskTypeList}
          entityName={'workTaskType'}
        />

        <div className={'w-full flex items-center gap-2'}>
          <Title>Year {yearGroup}</Title>
        </div>
        <div className={'w-full my-4'}>
          <Grid numItemsSm={1} numItemsLg={3} className="gap-4">
            <AddNewCurriculumModelCard
              alreadyUnsaved={false}
              yearGroup={parseTen(yearGroup)}
            />
            <DtoControllerArray
              dtoList={workProjectSeriesSchemaList}
              entityName={'workProjectSeriesSchema'}
              updateServerAction={putList}
              deleteServerAction={deleteIdList}
            />
            <SchemaArrayWrapper />
          </Grid>
        </div>
      </CurriculumModelNameListValidator>
    </>
  );
}
