import {
  ActionResponse,
  ActionResponsePromise,
  errorResponse,
  successResponse
} from './actionResponse';
import { WorkProjectSeriesSchemaDto } from '../dtos/WorkProjectSeriesSchemaDtoSchema';
import { API_BASE_URL, Page } from '../main';
import { GraphDto } from '../zod-mods';
import { PartyDto } from '../dtos/PartyDtoSchema';
import { WorkProjectSeriesDeliveryDto } from '../dtos/WorkProjectSeriesDeliveryDtoSchema';
import { WorkSeriesBundleDeliveryDto } from '../dtos/WorkSeriesBundleDeliveryDtoSchema';
import { number } from 'zod';
import { WorkSeriesSchemaBundleLeanDto } from '../dtos/WorkSeriesSchemaBundleLeanDtoSchema';

export async function getCurriculumDeliveryModelSchemas(
  yearGroup?: number,
  page: number = 0,
  size: number = 10
): ActionResponsePromise<Page<WorkProjectSeriesSchemaDto>> {
  let url = `${API_BASE_URL}/workProjectSeriesSchemas`;
  const paging = `?page=${page}&size=${size}&sort=name,asc`;
  if (!!yearGroup) {
    url = `${url}/knowledge-level-ordinal/${yearGroup}`;
  }
  url = url + paging;
  try {
    const response = await fetch(url, {
      cache: 'no-cache'
    });
    const schemas: Page<WorkProjectSeriesSchemaDto> = await response.json();
    return successResponse(schemas);
  } catch (error) {
    console.error('Error fetching data: ', error);
    return errorResponse(`${error}`);
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
    return successResponse(graph);
  } catch (error) {
    console.error('Error fetching data: ', error);
    return errorResponse(`${error}`);
  }
}
export async function getCurriculumDeliveries(
  idList: number[]
): ActionResponsePromise<WorkSeriesBundleDeliveryDto[]> {
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
    const deliveries: WorkSeriesBundleDeliveryDto[] = await response.json();
    return successResponse(deliveries);
  } catch (error) {
    console.error('Error fetching data: ', error);
    return errorResponse(`${error}`);
  }
}

export async function getBundles(
  idList: string[]
): ActionResponsePromise<WorkSeriesSchemaBundleLeanDto[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/workProjectSeriesSchemas/bundles/schema-id-list`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // Indicate we're sending JSON data
        },
        cache: 'no-cache',
        body: JSON.stringify(idList)
      }
    );
    const deliveries: WorkSeriesSchemaBundleLeanDto[] = await response.json();
    return successResponse(deliveries);
  } catch (error) {
    console.error('Error fetching data: ', error);
    return errorResponse(`${error}`);
  }
}
