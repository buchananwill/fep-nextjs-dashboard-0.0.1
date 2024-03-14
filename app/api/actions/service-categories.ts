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
import { getWithoutBody } from './template-actions';

export async function getServiceCategory(
  id: number
): ActionResponsePromise<ServiceCategoryDto> {
  const url = `${API_BASE_URL}/serviceCategories/${id}`;
  return getWithoutBody(url);
}

export async function getKnowledgeLevels(
  serviceCategoryId: number
): ActionResponsePromise<KnowledgeLevelDto[]> {
  const url = `${API_BASE_URL}/serviceCategories/${serviceCategoryId}/knowledgeLevels`;
  return getWithoutBody(url);
}
