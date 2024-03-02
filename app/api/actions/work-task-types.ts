import {
  ActionResponse,
  ActionResponsePromise,
  errorResponse,
  successResponse
} from './actionResponse';
import { GraphDto } from '../zod-mods';
import { PartyDto } from '../dtos/PartyDtoSchema';
import { API_BASE_URL } from '../main';
import { WorkTaskTypeDto } from '../dtos/WorkTaskTypeDtoSchema';
import { WorkProjectSeriesSchemaDto } from '../dtos/WorkProjectSeriesSchemaDtoSchema';

export async function getWorkTaskTypeGraph(): ActionResponsePromise<
  GraphDto<WorkTaskTypeDto>
> {
  try {
    const response = await fetch(`${API_BASE_URL}/graphs/workTaskTypes`, {
      cache: 'no-cache'
    });
    const graph: GraphDto<WorkTaskTypeDto> = await response.json();
    return successResponse(graph);
  } catch (error) {
    console.error('Error fetching data: ', error);
    return errorResponse(`${error}`);
  }
}

export async function getWorkTaskTypes(
  serviceCategoryId: number,
  knowledgeLevelOrdinal?: number
): ActionResponsePromise<WorkTaskTypeDto[]> {
  const queryParams = knowledgeLevelOrdinal
    ? `?knowledgeLevelOrdinal=${knowledgeLevelOrdinal}`
    : '';

  try {
    const response = await fetch(
      `${API_BASE_URL}/workTasks/${serviceCategoryId}/types${queryParams}`,
      {
        cache: 'no-cache'
      }
    );
    const taskTypes: WorkTaskTypeDto[] = await response.json();
    return successResponse(taskTypes);
  } catch (error) {
    console.error('Error fetching data: ', error);
    return errorResponse(`${error}`);
  }
}

export async function putWorkTaskTypes(
  modelList: WorkTaskTypeDto[]
): ActionResponsePromise<WorkTaskTypeDto[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/workTasks/types`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json' // Indicate we're sending JSON data
      },
      cache: 'no-cache',
      body: JSON.stringify(modelList)
    });
    const deliveries: WorkTaskTypeDto[] = await response.json();
    return successResponse(deliveries);
  } catch (error) {
    console.error('Error fetching data: ', error);
    return errorResponse(`${error}`);
  }
}
