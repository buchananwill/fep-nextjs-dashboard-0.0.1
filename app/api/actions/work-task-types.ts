'use server';
import { ActionResponsePromise } from './actionResponse';
import { GraphDto, GraphDtoPutRequestBody } from '../zod-mods';
import { API_BASE_URL } from '../main';
import { WorkTaskTypeDto } from '../dtos/WorkTaskTypeDtoSchema';
import {
  getWithoutBody,
  putEntities,
  putRequestWithDifferentReturnType
} from './template-actions';

const workTaskTypesEndpointUrl = `${API_BASE_URL}/workTasks/types`;
export async function getWorkTaskTypeGraph(
  typeNameLike: string
): ActionResponsePromise<GraphDto<WorkTaskTypeDto>> {
  const url = `${workTaskTypesEndpointUrl}/graph?typeNameLike=${typeNameLike}`;
  return getWithoutBody(url);
}
export async function putWorkTaskTypeGraph(
  graph: GraphDtoPutRequestBody<WorkTaskTypeDto>
): ActionResponsePromise<GraphDto<WorkTaskTypeDto>> {
  const url = `${workTaskTypesEndpointUrl}/graph`;
  return putRequestWithDifferentReturnType<
    GraphDtoPutRequestBody<WorkTaskTypeDto>,
    GraphDto<WorkTaskTypeDto>
  >(graph, url);
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
