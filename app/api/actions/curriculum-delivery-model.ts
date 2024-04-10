'use server';
import { ActionResponsePromise } from './actionResponse';
import { WorkProjectSeriesSchemaDto } from '../dtos/WorkProjectSeriesSchemaDtoSchema';
import { API_BASE_URL, Page } from '../main';
import { WorkSeriesBundleAssignmentDto } from '../dtos/WorkSeriesBundleAssignmentDtoSchema';
import {
  deleteEntities,
  getDtoListByIds,
  getWithoutBody,
  postEntities,
  putEntities
} from './template-actions';

const SCHEMA_URL = `${API_BASE_URL}/workProjectSeriesSchemas`;
export async function getCurriculumDeliveryModelSchemasByKnowledgeLevel(
  page: number = 0,
  size: number = 10,
  yearGroup?: number
): ActionResponsePromise<Page<WorkProjectSeriesSchemaDto>> {
  let url = SCHEMA_URL;
  const paging = `?page=${page}&size=${size}&sort=name,asc`;
  if (!!yearGroup) {
    url = `${url}/knowledge-level-ordinal/${yearGroup}`;
  }
  url = url + paging;
  return await getWithoutBody<Page<WorkProjectSeriesSchemaDto>>(url);
}

export async function deleteCurriculumDeliveryModels(schemaIdList: string[]) {
  return deleteEntities(schemaIdList, SCHEMA_URL);
}

export async function getSchemasByIdList(idList: string[]) {
  const url = `${API_BASE_URL}/v2/workProjectSeriesSchemas/listById`;

  // UUID regex pattern
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  idList.forEach((uuid) => {
    if (!uuidRegex.test(uuid)) console.log(uuid);
  });

  return await getDtoListByIds<string, WorkProjectSeriesSchemaDto>(idList, url);
}

export async function getCurriculumDeliveries(
  idList: number[]
): ActionResponsePromise<WorkSeriesBundleAssignmentDto[]> {
  const urlForDeliveries = `${SCHEMA_URL}/assignments/by-party-id`;
  return getDtoListByIds(idList, urlForDeliveries);
}

export async function putModels(
  modelList: WorkProjectSeriesSchemaDto[]
): ActionResponsePromise<WorkProjectSeriesSchemaDto[]> {
  return putEntities(modelList, SCHEMA_URL);
}
export async function postModels(
  modelList: WorkProjectSeriesSchemaDto[]
): ActionResponsePromise<WorkProjectSeriesSchemaDto[]> {
  return postEntities(modelList, SCHEMA_URL);
}
