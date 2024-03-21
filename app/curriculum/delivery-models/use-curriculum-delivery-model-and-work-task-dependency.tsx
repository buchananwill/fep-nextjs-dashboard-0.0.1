import { WorkProjectSeriesSchemaDto } from '../../api/dtos/WorkProjectSeriesSchemaDtoSchema';
import { WorkTaskTypeDto } from '../../api/dtos/WorkTaskTypeDtoSchema';
import { useCurriculumModelContext } from './contexts/use-curriculum-model-context';
import { useWorkTaskTypeContext } from './contexts/use-work-task-type-context';
import { useSelectiveContextListenerBoolean } from '../../components/selective-context/selective-context-manager-boolean';
import { UnsavedCurriculumModelChanges } from './contexts/curriculum-models-context-provider';
import { useEditingContextDependency } from './use-editing-context-dependency';
import { HasUuidDto } from '../../api/dtos/HasUuidDtoSchema';

export interface CurriculumDeliveryModelEditingProps {
  workProjectSeriesSchemaDtos: WorkProjectSeriesSchemaDto[];
  taskTypeList: WorkTaskTypeDto[];
}

export function UuidAccessor<T extends HasUuidDto>(entity: T) {
  return entity.id;
}

export function useCurriculumDeliveryModelAndWorkTaskDependency(
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
  useEditingContextDependency(
    workProjectSeriesSchemaDtos,
    dispatch,
    UuidAccessor
  );

  useEditingContextDependency(taskTypeList, workTaskTypeDispatch, (wtt) =>
    wtt.id.toString()
  );

  return { alreadyUnsaved, curriculumModelsMap };
}
