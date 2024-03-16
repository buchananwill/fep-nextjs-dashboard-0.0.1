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
import { getWithoutBody, patchEntity } from './template-actions';
import { KnowledgeDomainDto } from '../dtos/KnowledgeDomainDtoSchema';

const serviceCategoriesApi = `${API_BASE_URL}/serviceCategories`;

export async function getServiceCategoryByIdentifier(
  id: string
): ActionResponsePromise<ServiceCategoryDto> {
  const url = `${serviceCategoriesApi}/${id}`;
  return getWithoutBody(url);
}

export async function getServiceCategoryNames() {
  const url = `${serviceCategoriesApi}/names`;
  return getWithoutBody(url);
}

export async function getKnowledgeLevels(
  serviceCategoryId: string
): ActionResponsePromise<KnowledgeLevelDto[]> {
  const url = `${serviceCategoriesApi}/${serviceCategoryId}/knowledgeLevels`;
  return getWithoutBody(url);
}
export async function getKnowledgeDomains(
  serviceCategoryId: string
): ActionResponsePromise<KnowledgeDomainDto[]> {
  const url = `${serviceCategoriesApi}/${serviceCategoryId}/knowledgeDomains`;
  return getWithoutBody(url);
}

export async function patchKnowledgeDomain(
  knowledgeDomainDto: KnowledgeDomainDto
): ActionResponsePromise<KnowledgeDomainDto> {
  const url = `${serviceCategoriesApi}/${knowledgeDomainDto.serviceCategoryId}/knowledgeDomains`;
  return patchEntity(knowledgeDomainDto, url);
}
