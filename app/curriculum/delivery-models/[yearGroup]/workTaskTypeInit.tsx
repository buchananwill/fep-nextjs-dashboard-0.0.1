'use client';
import { WorkTaskTypeDto } from '../../../api/dtos/WorkTaskTypeDtoSchema';
import { useEditingContextDependency } from '../use-editing-context-dependency';
import { useWorkTaskTypeContext } from '../contexts/use-work-task-type-context';
const workTaskTypeIdAccessor = (wtt: WorkTaskTypeDto) => wtt.id.toString();

export function WorkTaskTypeInit({
  workTaskTypes
}: {
  workTaskTypes: WorkTaskTypeDto[];
}) {
  const { dispatch } = useWorkTaskTypeContext();
  useEditingContextDependency(workTaskTypes, dispatch, workTaskTypeIdAccessor);
  return null;
}
