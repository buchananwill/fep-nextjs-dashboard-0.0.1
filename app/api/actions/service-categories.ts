'use server';
import { ActionResponsePromise } from './actionResponse';
import { API_BASE_URL } from '../main';
import { ServiceCategoryDto } from '../dtos/ServiceCategoryDtoSchema';
import { KnowledgeLevelDto } from '../dtos/KnowledgeLevelDtoSchema';
import {
  deleteEntities,
  getWithoutBody,
  patchEntity,
  patchEntityList,
  postEntity
} from './template-actions';
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
export async function getAllKnowledgeLevels(): ActionResponsePromise<
  KnowledgeLevelDto[]
> {
  const url = `${serviceCategoriesApi}/knowledgeLevels`;
  return getWithoutBody(url);
}

export async function patchKnowledgeLevels(
  serviceCategory: ServiceCategoryDto,
  knowledgeLevelDtoList: KnowledgeLevelDto[]
): ActionResponsePromise<KnowledgeLevelDto[]> {
  const url = `${serviceCategoriesApi}/${serviceCategory.id}/knowledgeLevels`;
  return patchEntityList(knowledgeLevelDtoList, url);
}
export async function postKnowledgeLevel(
  knowledgeLevelDto: KnowledgeLevelDto
): ActionResponsePromise<KnowledgeLevelDto> {
  const url = `${serviceCategoriesApi}/${knowledgeLevelDto.serviceCategoryId}/knowledgeLevels`;
  return postEntity(knowledgeLevelDto, url);
}
export async function deleteKnowledgeLevel(
  knowledgeLevelDto: KnowledgeLevelDto
): ActionResponsePromise<KnowledgeLevelDto[]> {
  const url = `${serviceCategoriesApi}/${knowledgeLevelDto.serviceCategoryId}/knowledgeLevels`;
  return deleteEntities([knowledgeLevelDto], url);
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

export async function patchKnowledgeDomain(
  knowledgeDomainDto: KnowledgeDomainDto
): ActionResponsePromise<KnowledgeDomainDto> {
  const url = `${serviceCategoriesApi}/${knowledgeDomainDto.serviceCategoryId}/knowledgeDomains`;
  return patchEntity(knowledgeDomainDto, url);
}
export async function postKnowledgeDomain(
  knowledgeDomainDto: KnowledgeDomainDto
): ActionResponsePromise<KnowledgeDomainDto> {
  const url = `${serviceCategoriesApi}/${knowledgeDomainDto.serviceCategoryId}/knowledgeDomains`;
  return postEntity(knowledgeDomainDto, url);
}
export async function deleteKnowledgeDomain(
  knowledgeDomainDto: KnowledgeDomainDto
): ActionResponsePromise<KnowledgeDomainDto[]> {
  const url = `${serviceCategoriesApi}/${knowledgeDomainDto.serviceCategoryId}/knowledgeDomains`;
  return deleteEntities([knowledgeDomainDto], url);
}
