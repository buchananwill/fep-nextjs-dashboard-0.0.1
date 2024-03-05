import { WorkProjectSeriesSchemaDto } from '../api/dtos/WorkProjectSeriesSchemaDtoSchema';
import { WorkTaskTypeDto } from '../api/dtos/WorkTaskTypeDtoSchema';
import { useCurriculumModelContext } from './contexts/use-curriculum-model-context';
import { useWorkTaskTypeContext } from './contexts/use-work-task-type-context';
import { useSelectiveContextListenerBoolean } from '../components/selective-context/selective-context-manager-boolean';
import { UnsavedCurriculumModelChanges } from './contexts/curriculum-models-context-provider';
import { useEffect } from 'react';
import { StringMapPayload } from './contexts/string-map-context-creator';

export interface CurriculumDeliveryModelEditingProps {
  workProjectSeriesSchemaDtos: WorkProjectSeriesSchemaDto[];
  taskTypeList: WorkTaskTypeDto[];
}

export function getPayloadArray<T>(
  itemArray: T[],
  keyAccessor: (item: T) => string
): StringMapPayload<T>[] {
  return itemArray.map((item) => ({
    key: keyAccessor(item),
    data: item
  }));
}

export function useCurriculumDeliveryModelEditing(
  workProjectSeriesSchemaDtos: WorkProjectSeriesSchemaDto[],
  taskTypeList: WorkTaskTypeDto[]
) {
  const { curriculumModelsMap, dispatch } = useCurriculumModelContext();
  const { dispatch: workTaskTypeDispatch } = useWorkTaskTypeContext();
  const { isTrue: alreadyUnsaved } = useSelectiveContextListenerBoolean(
    UnsavedCurriculumModelChanges,
    'all-models',
    false
  );

  console.log(workProjectSeriesSchemaDtos, taskTypeList);

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
  return alreadyUnsaved;
}
