import { Card, Grid, Title } from '@tremor/react';
import {
  normalizeQueryParamToNumber,
  oneIndexToZeroIndex
} from '../../../api/utils';
import { StringMap } from '../../../contexts/string-map-context/string-map-reducer';
import { WorkProjectSeriesSchemaDto } from '../../../api/dtos/WorkProjectSeriesSchemaDtoSchema';
import { WorkTaskTypeInit } from './workTaskTypeInit';
import { getDtoListByExampleList } from '../../../api/READ-ONLY-generated-actions/WorkTaskType';
import {
  getDtoListByExampleList as getSchemaListFromExampleList,
  putList
} from '../../../api/READ-ONLY-generated-actions/WorkProjectSeriesSchema';
import { parseTen } from '../../../api/date-and-time';
import { createSchemeExampleListFromWorkTaskTypes } from './bundles/createSchemeExampleListFromWorkTaskTypes';
import { EmptyArray } from '../../../api/main';
import { CurriculumModelNameListValidator } from './curriculum-model-name-list-validator';
import React from 'react';
import { AddNewCurriculumModelCard } from '../add-new-curriculum-model-card';
import DtoControllerArray from '../../../selective-context/components/controllers/dto-controller-array';
import SchemaArrayWrapper from './schema-array-wrapper';

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

  const schemaExampleList = createSchemeExampleListFromWorkTaskTypes(
    taskTypesResponse.data || EmptyArray
  );

  console.log(schemaExampleList);

  const curriculumDeliveryModelSchemas =
    await getSchemaListFromExampleList(schemaExampleList);

  const { data, status, message } = curriculumDeliveryModelSchemas;
  const { data: taskTypeList } = taskTypesResponse;
  if (data === undefined || taskTypeList === undefined) {
    return <Card>No schemas found!</Card>;
  }

  const stringMap: StringMap<WorkProjectSeriesSchemaDto> = {};
  data.forEach((schema) => {
    stringMap[schema.id] = schema;
  });

  if (status >= 400) {
    return <Card>{message}</Card>;
  }
  return (
    <>
      <CurriculumModelNameListValidator>
        <WorkTaskTypeInit workTaskTypes={taskTypeList} />
        <div className={'w-full flex items-center gap-2'}>
          <Title>
            Year {yearGroup} {/*-Page {pageNumber} of {totalPages}*/}
          </Title>
        </div>
        <div className={'w-full my-4'}>
          <Grid numItemsSm={1} numItemsLg={3} className="gap-4">
            <AddNewCurriculumModelCard
              alreadyUnsaved={false}
              yearGroup={parseTen(yearGroup)}
            />
            <DtoControllerArray
              dtoArray={data}
              entityName={'workProjectSeriesSchema'}
              commitServerAction={putList}
            />
            <SchemaArrayWrapper />
          </Grid>
        </div>
      </CurriculumModelNameListValidator>
    </>
  );
}
