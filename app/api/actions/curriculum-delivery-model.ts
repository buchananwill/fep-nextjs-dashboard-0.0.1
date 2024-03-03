'use server';
import {
  ActionResponsePromise,
  errorResponse,
  successResponse
} from './actionResponse';
import { WorkProjectSeriesSchemaDto } from '../dtos/WorkProjectSeriesSchemaDtoSchema';
import { API_BASE_URL, Page } from '../main';
import { GraphDto } from '../zod-mods';
import { WorkSeriesBundleDeliveryDto } from '../dtos/WorkSeriesBundleDeliveryDtoSchema';
import { WorkSeriesSchemaBundleLeanDto } from '../dtos/WorkSeriesSchemaBundleLeanDtoSchema';
import { OrganizationDto } from '../dtos/OrganizationDtoSchema';

const SCHEMA_URL = `${API_BASE_URL}/workProjectSeriesSchemas`;

export async function getCurriculumDeliveryModelSchemas(
  yearGroup?: number,
  page: number = 0,
  size: number = 10
): ActionResponsePromise<Page<WorkProjectSeriesSchemaDto>> {
  let url = SCHEMA_URL;
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
  GraphDto<OrganizationDto>
> {
  try {
    const response = await fetch(`${API_BASE_URL}/graphs/organizations`, {
      cache: 'no-cache'
    });
    const graph: GraphDto<OrganizationDto> = await response.json();
    return successResponse(graph);
  } catch (error) {
    console.error('Error fetching data: ', error);
    return errorResponse(`${error}`);
  }
}

export async function putOrganizationGraph(
  updatedGraph: GraphDto<OrganizationDto>
): ActionResponsePromise<GraphDto<OrganizationDto>> {
  try {
    console.log(updatedGraph);
    const response = await fetch(`${API_BASE_URL}/graphs/organizations`, {
      cache: 'no-cache',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json' // Indicate we're sending JSON data
      },
      body: JSON.stringify(updatedGraph)
    });
    const responseGraph: GraphDto<OrganizationDto> = await response.json();
    console.log(responseGraph);
    return successResponse(responseGraph);
  } catch (error) {
    console.error('Error fetching data: ', error);
    return errorResponse(`${error}`);
  }
}

export async function getCurriculumDeliveries(
  idList: number[]
): ActionResponsePromise<WorkSeriesBundleDeliveryDto[]> {
  try {
    const response = await fetch(`${SCHEMA_URL}/deliveries/by-party-id`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Indicate we're sending JSON data
      },
      cache: 'no-cache',
      body: JSON.stringify(idList)
    });
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
    const response = await fetch(`${SCHEMA_URL}/bundles/schema-id-list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Indicate we're sending JSON data
      },
      cache: 'no-cache',
      body: JSON.stringify(idList)
    });
    const deliveries: WorkSeriesSchemaBundleLeanDto[] = await response.json();
    return successResponse(deliveries);
  } catch (error) {
    console.error('Error fetching data: ', error);
    return errorResponse(`${error}`);
  }
}
export async function putModels(
  modelList: WorkProjectSeriesSchemaDto[]
): ActionResponsePromise<WorkProjectSeriesSchemaDto[]> {
  try {
    const response = await fetch(`${SCHEMA_URL}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json' // Indicate we're sending JSON data
      },
      cache: 'no-cache',
      body: JSON.stringify(modelList)
    });
    const deliveries: WorkProjectSeriesSchemaDto[] = await response.json();
    return successResponse(deliveries);
  } catch (error) {
    console.error('Error fetching data: ', error);
    return errorResponse(`${error}`);
  }
}
export async function postModels(
  modelList: WorkProjectSeriesSchemaDto[]
): ActionResponsePromise<WorkProjectSeriesSchemaDto[]> {
  try {
    const response = await fetch(`${SCHEMA_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Indicate we're sending JSON data
      },
      cache: 'no-cache',
      body: JSON.stringify(modelList)
    });
    const deliveries: WorkProjectSeriesSchemaDto[] = await response.json();
    return successResponse(deliveries);
  } catch (error) {
    console.error('Error fetching data: ', error);
    return errorResponse(`${error}`);
  }
}

export async function postBundleDeliveries(
  bundleAssignments: { partyId: number; bundleId: number }[]
): ActionResponsePromise<WorkSeriesBundleDeliveryDto[]> {
  console.log(API_BASE_URL, SCHEMA_URL);
  try {
    const response = await fetch(`${SCHEMA_URL}/deliveries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Indicate we're sending JSON data
      },
      cache: 'no-cache',
      body: JSON.stringify(bundleAssignments)
    });
    const deliveries: WorkSeriesBundleDeliveryDto[] = await response.json();
    return successResponse(deliveries);
  } catch (error) {
    console.error('Error fetching data: ', error);
    return errorResponse(`${error}`);
  }
}
