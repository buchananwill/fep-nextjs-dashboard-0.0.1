import { ActionResponse, ActionResponsePromise } from './actionResponse';
import { WorkProjectSeriesSchemaDto } from '../dtos/WorkProjectSeriesSchemaDtoSchema';
import { API_BASE_URL, Page } from '../main';
import { GraphDto } from '../zod-mods';
import { PartyDto } from '../dtos/PartyDtoSchema';
import { WorkProjectSeriesDeliveryDto } from '../dtos/WorkProjectSeriesDeliveryDtoSchema';

export async function getCurriculumDeliveryModelSchemas(): ActionResponsePromise<
  WorkProjectSeriesSchemaDto[]
> {
  try {
    const response = await fetch(`${API_BASE_URL}/workProjectSeriesSchemas`, {
      cache: 'no-cache'
    });
    const schemas: Page<WorkProjectSeriesSchemaDto> = await response.json();
    return ActionResponse.success(schemas.content);
  } catch (error) {
    console.error('Error fetching data: ', error);
    return ActionResponse.error(`${error}`);
  }
}

export async function getOrganizationGraph(): ActionResponsePromise<
  GraphDto<PartyDto>
> {
  try {
    const response = await fetch(`${API_BASE_URL}/graphs/organizations`, {
      cache: 'no-cache'
    });
    const graph: GraphDto<PartyDto> = await response.json();
    return ActionResponse.success(graph);
  } catch (error) {
    console.error('Error fetching data: ', error);
    return ActionResponse.error(`${error}`);
  }
}
export async function getCurriculumDeliveries(
  idList: number[]
): ActionResponsePromise<WorkProjectSeriesDeliveryDto[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/workProjectSeriesSchemas/deliveries/by-party-id`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // Indicate we're sending JSON data
        },
        cache: 'no-cache',
        body: JSON.stringify(idList)
      }
    );
    const deliveries: WorkProjectSeriesDeliveryDto[] = await response.json();
    return ActionResponse.success(deliveries);
  } catch (error) {
    console.error('Error fetching data: ', error);
    return ActionResponse.error(`${error}`);
  }
}
