'use server';
import { ActionResponsePromise } from '../actionResponse';
import { WorkProjectSeriesSchemaDto } from '../../dtos/WorkProjectSeriesSchemaDtoSchema';
import { API_BASE_URL, Page } from '../../main';
import { getWithoutBody } from '../template-actions';

const SCHEMA_URL = `${API_BASE_URL}/workProjectSeriesSchemas`;

// TODO REMOVE/MIGRATE THIS FUNCTION
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
