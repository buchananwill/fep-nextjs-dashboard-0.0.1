'use server';
import {
  ActionResponsePromise,
  errorResponse,
  successResponse
} from './actionResponse';
import { WorkSeriesSchemaBundleLeanDto } from '../dtos/WorkSeriesSchemaBundleLeanDtoSchema';
import { API_BASE_URL } from '../main';
import { ServiceCategoryDto } from '../dtos/ServiceCategoryDtoSchema';
import { KnowledgeLevelDto } from '../dtos/KnowledgeLevelDtoSchema';

export async function getServiceCategory(
  id: number
): ActionResponsePromise<ServiceCategoryDto> {
  try {
    const response = await fetch(`${API_BASE_URL}/serviceCategories/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json' // Indicate we're sending JSON data
      },
      cache: 'default'
    });
    const service: ServiceCategoryDto = await response.json();
    return successResponse(service);
  } catch (error) {
    console.error('Error fetching data: ', error);
    return errorResponse(`${error}`);
  }
}

export async function getKnowledgeLevels(
  serviceCategoryId: number
): ActionResponsePromise<KnowledgeLevelDto[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/serviceCategories/${serviceCategoryId}/knowledgeLevels`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json' // Indicate we're sending JSON data
        },
        cache: 'default'
      }
    );
    const levels: KnowledgeLevelDto[] = await response.json();
    return successResponse(levels);
  } catch (error) {
    console.error('Error fetching data: ', error);
    return errorResponse(`${error}`);
  }
}
