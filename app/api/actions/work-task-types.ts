import { ActionResponsePromise } from './actionResponse';
import { GraphDto } from '../zod-mods';
import { API_BASE_URL } from '../main';
import { WorkTaskTypeDto } from '../dtos/WorkTaskTypeDtoSchema';
import { getWithoutBody, putEntities } from './template-actions';

export async function getWorkTaskTypeGraph(
  typeNameLike: string
): ActionResponsePromise<GraphDto<WorkTaskTypeDto>> {
  const url = `${API_BASE_URL}/workTasks/types/graph?typeNameLike=${typeNameLike}`;
  return getWithoutBody(url);
}
export async function putWorkTaskTypeGraph(
  graph: GraphDto<WorkTaskTypeDto>
): ActionResponsePromise<GraphDto<WorkTaskTypeDto>> {
  const url = `${API_BASE_URL}/workTasks/types/graph`;
  return getWithoutBody(url);
}

export async function getWorkTaskTypes(
  serviceCategoryId: number,
  knowledgeLevelOrdinal?: number
): ActionResponsePromise<WorkTaskTypeDto[]> {
  const queryParams = knowledgeLevelOrdinal
    ? `?knowledgeLevelOrdinal=${knowledgeLevelOrdinal}`
    : '';

  const url = `${API_BASE_URL}/workTasks/${serviceCategoryId}/types${queryParams}`;

  return getWithoutBody(url);
}

export async function putWorkTaskTypes(
  modelList: WorkTaskTypeDto[]
): ActionResponsePromise<WorkTaskTypeDto[]> {
  const url = `${API_BASE_URL}/workTasks/types`;

  return putEntities(modelList, url);
}
