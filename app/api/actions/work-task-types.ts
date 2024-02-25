import { ActionResponse, ActionResponsePromise } from './actionResponse';
import { GraphDto } from '../zod-mods';
import { PartyDto } from '../dtos/PartyDtoSchema';
import { API_BASE_URL } from '../main';
import { WorkTaskTypeDto } from '../dtos/WorkTaskTypeDtoSchema';

export async function getWorkTaskTypeGraph(): ActionResponsePromise<
  GraphDto<WorkTaskTypeDto>
> {
  try {
    const response = await fetch(`${API_BASE_URL}/graphs/workTaskTypes`, {
      cache: 'no-cache'
    });
    const graph: GraphDto<WorkTaskTypeDto> = await response.json();
    return ActionResponse.success(graph);
  } catch (error) {
    console.error('Error fetching data: ', error);
    return ActionResponse.error(`${error}`);
  }
}
