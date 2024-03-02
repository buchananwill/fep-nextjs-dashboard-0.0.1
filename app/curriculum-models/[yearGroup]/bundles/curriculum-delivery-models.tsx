'use client';
import { WorkProjectSeriesSchemaDto } from '../../../api/dtos/WorkProjectSeriesSchemaDtoSchema';
import { Grid } from '@tremor/react';
import { CurriculumDeliveryModel } from '../../curriculum-delivery-model';
import React, { useEffect } from 'react';

import { useCurriculumModelContext } from '../../contexts/use-curriculum-model-context';
import { AddNewCurriculumModelCard } from '../../add-new-curriculum-model-card';
import { WorkTaskTypeDto } from '../../../api/dtos/WorkTaskTypeDtoSchema';
import { useWorkTaskTypeContext } from '../../contexts/use-work-task-type-context';
import { useSelectiveContextListenerBoolean } from '../../../components/selective-context/selective-context-manager-boolean';
import { UnsavedCurriculumModelChanges } from '../../contexts/curriculum-models-context-provider';

export const curriculumDeliveryCommitKey = 'commit-model-changes-open';

export function getPayloadArray<T>(
  itemArray: T[],
  keyAccessor: (item: T) => string
) {
  return itemArray.map((schema) => ({
    key: keyAccessor(schema),
    data: schema
  }));
}

export function CurriculumDeliveryModels({
  workProjectSeriesSchemaDtos,
  taskTypeList,
  yearGroup
}: {
  workProjectSeriesSchemaDtos: WorkProjectSeriesSchemaDto[];
  taskTypeList: WorkTaskTypeDto[];
  yearGroup: number;
}) {
  const { curriculumModelsMap, dispatch } = useCurriculumModelContext();
  const { dispatch: workTaskTypeDispatch } = useWorkTaskTypeContext();
  const { isTrue: alreadyUnsaved } = useSelectiveContextListenerBoolean(
    UnsavedCurriculumModelChanges,
    'all-models',
    false
  );

  useEffect(() => {
    const payloadArray = getPayloadArray(
      workProjectSeriesSchemaDtos,
      (schema) => schema.id
    );
    dispatch({
      type: 'updateAll',
      payload: payloadArray
    });
  }, [workProjectSeriesSchemaDtos, dispatch]);
  useEffect(() => {
    const payloadArray = getPayloadArray(taskTypeList, (taskType) =>
      taskType.id.toString()
    );
    workTaskTypeDispatch({
      type: 'updateAll',
      payload: payloadArray
    });
  }, [workTaskTypeDispatch, taskTypeList]);

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
