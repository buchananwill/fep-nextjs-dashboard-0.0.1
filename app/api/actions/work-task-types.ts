'use server';
import { ActionResponsePromise } from './actionResponse';
import { GraphDto, GraphDtoPutRequestBody } from '../zod-mods';
import { API_BASE_URL, joinSearchParams } from '../main';
import { WorkTaskTypeDto } from '../dtos/WorkTaskTypeDtoSchema';
import {
  getWithoutBody,
  postEntitiesWithDifferentReturnType,
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

export async function getWorkTaskTypes(searchParams: {
  rootName?: string;
  serviceCategoryDto?: string;
  knowledgeDomain?: string;
  knowledgeLevelOrdinal?: string;
}): ActionResponsePromise<WorkTaskTypeDto[]> {
  const joinedParams = joinSearchParams(searchParams);
  const queryParams = joinedParams.length > 0 ? `?${joinedParams}` : '';

  const url = `${API_BASE_URL}/workTasks/types${queryParams}`;

  return getWithoutBody(url);
}

export async function getWorkTaskTypesByWorkProjectSeriesSchemaIdList(
  idList: string[]
): ActionResponsePromise<WorkTaskTypeDto[]> {
  const url = `${API_BASE_URL}/v2/workTaskTypes/byWorkProjectSeriesSchemaIdList`;

  return postEntitiesWithDifferentReturnType<string[], WorkTaskTypeDto[]>(
    idList,
    url
  );
}
