import { WorkTaskDto } from '../../api/zod-mods';
import { createContext, Dispatch, DispatchWithoutAction } from 'react';
import { AddEditedTask, TaskDispatch } from './workshop-task-context-provider';

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
