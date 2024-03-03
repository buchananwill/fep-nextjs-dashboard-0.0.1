'use client';
import { WorkProjectSeriesSchemaDto } from '../api/dtos/WorkProjectSeriesSchemaDtoSchema';
import { Grid } from '@tremor/react';
import { CurriculumDeliveryModel } from './curriculum-delivery-model';
import React from 'react';
import { AddNewCurriculumModelCard } from './add-new-curriculum-model-card';
import { WorkTaskTypeDto } from '../api/dtos/WorkTaskTypeDtoSchema';
import { useCurriculumDeliveryModelEditing } from './use-curriculum-delivery-model-editing';

export const curriculumDeliveryCommitKey = 'commit-model-changes-open';

export function CurriculumDeliveryModels({
  workProjectSeriesSchemaDtos,
  taskTypeList,
  yearGroup
}: {
  workProjectSeriesSchemaDtos: WorkProjectSeriesSchemaDto[];
  taskTypeList: WorkTaskTypeDto[];
  yearGroup: number;
}) {
  const alreadyUnsaved = useCurriculumDeliveryModelEditing(
    workProjectSeriesSchemaDtos,
    taskTypeList
  );

  return (
    <div className={'w-full my-4'}>
      <Grid numItemsSm={2} numItemsLg={4} className="gap-4">
        <AddNewCurriculumModelCard
          alreadyUnsaved={alreadyUnsaved}
          yearGroup={yearGroup}
        />
        {workProjectSeriesSchemaDtos.map((item, index) => (
          <CurriculumDeliveryModel key={item.id} model={item} />
        ))}
      </Grid>
    </div>
  );
}
