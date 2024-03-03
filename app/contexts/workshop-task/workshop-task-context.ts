import { createContext, Dispatch, DispatchWithoutAction } from 'react';
import { TaskDispatch } from './workshop-task-context-provider';
import { WorkTaskDto } from '../../api/dtos/WorkTaskDtoSchema';

export interface IWorkshopTaskContext {
  editedTasks: WorkTaskDto[];
}

export const WorkshopTaskContext = createContext<IWorkshopTaskContext>({
  editedTasks: []
});

export interface WorkshopTaskDispatchContext {
  dispatch: Dispatch<TaskDispatch>;
}

export const WorkshopTaskDispatchContext =
  createContext<WorkshopTaskDispatchContext>({
    dispatch: () => {}
  });
