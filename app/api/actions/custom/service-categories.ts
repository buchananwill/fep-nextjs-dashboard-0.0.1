'use server';
import { ActionResponsePromise } from '../actionResponse';
import { API_BASE_URL } from '../../main';
import { ServiceCategoryDto } from '../../dtos/ServiceCategoryDtoSchema';
import { KnowledgeLevelDto } from '../../dtos/KnowledgeLevelDtoSchema';
import {
  deleteEntities,
  getWithoutBody,
  patchEntity,
  patchEntityList,
  postEntity
} from '../template-actions';
import { KnowledgeDomainDto } from '../../dtos/KnowledgeDomainDtoSchema';

const serviceCategoriesApi = `${API_BASE_URL}/serviceCategories`;

export async function getServiceCategoryByIdentifier(
  id: string
): ActionResponsePromise<ServiceCategoryDto> {
  const url = `${serviceCategoriesApi}/${id}`;
  return getWithoutBody(url);
}
export async function getKnowledgeLevels(
  serviceCategoryId: string
): ActionResponsePromise<KnowledgeLevelDto[]> {
  const url = `${serviceCategoriesApi}/${serviceCategoryId}/knowledgeLevels`;
  return getWithoutBody(url);
}
export async function getAllKnowledgeLevels(): ActionResponsePromise<
  KnowledgeLevelDto[]
> {
  const url = `${serviceCategoriesApi}/knowledgeLevels`;
  return getWithoutBody(url);
}
export async function getKnowledgeDomains(
  serviceCategoryId: string
): ActionResponsePromise<KnowledgeDomainDto[]> {
  const url = `${serviceCategoriesApi}/${serviceCategoryId}/knowledgeDomains`;
  return getWithoutBody(url);
}
export async function getAllKnowledgeDomains(): ActionResponsePromise<
  KnowledgeDomainDto[]
> {
  const url = `${serviceCategoriesApi}/knowledgeDomains`;
  return getWithoutBody(url);
}
