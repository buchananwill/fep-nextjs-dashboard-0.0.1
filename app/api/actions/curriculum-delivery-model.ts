'use server';
import { ActionResponsePromise } from './actionResponse';
import { WorkProjectSeriesSchemaDto } from '../dtos/WorkProjectSeriesSchemaDtoSchema';
import { API_BASE_URL, Page } from '../main';
import { GraphDto, GraphDtoPutRequestBody } from '../zod-mods';
import { WorkSeriesBundleAssignmentDto } from '../dtos/WorkSeriesBundleAssignmentDtoSchema';
import { WorkSeriesSchemaBundleLeanDto } from '../dtos/WorkSeriesSchemaBundleLeanDtoSchema';
import { OrganizationDto } from '../dtos/OrganizationDtoSchema';
import {
  deleteEntities,
  getDtoListByIds,
  getWithoutBody,
  postEntities,
  postEntitiesWithDifferentReturnType,
  putEntities,
  putRequestWithDifferentReturnType
} from './template-actions';
import { OrganizationTypeDto } from '../dtos/OrganizationTypeDtoSchema';
import { LongLongTuple } from '../dtos/LongLongTupleSchema';

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
export async function getBundleDeliveriesByOrgType(
  orgType: string
): ActionResponsePromise<WorkSeriesBundleAssignmentDto[]> {
  let url = SCHEMA_URL;
  url = `${url}/assignments/organizationType/${orgType.replaceAll(' ', '%20')}`;

  return await getWithoutBody<WorkSeriesBundleAssignmentDto[]>(url);
}

export async function getSchemasByIdList(idList: string[]) {
  const url = `${SCHEMA_URL}/byIdList`;
  return await getDtoListByIds<string, WorkProjectSeriesSchemaDto>(idList, url);
}

const organizationGraphEndpoint = `${API_BASE_URL}/v2/organizations/graphs`;

export async function getOrganizationGraph(): ActionResponsePromise<
  GraphDto<OrganizationDto>
> {
  return getWithoutBody(organizationGraphEndpoint);
}
export async function getOrganizationGraphByRootId(
  rootId: number
): ActionResponsePromise<GraphDto<OrganizationDto>> {
  return getWithoutBody(`${organizationGraphEndpoint}/byRootId/${rootId}`);
}

export async function getOrganizationGraphByOrganizationType(
  yearGroup: string
) {
  return getWithoutBody<GraphDto<OrganizationDto>>(
    `${organizationGraphEndpoint}/${yearGroup}`
  );
}

export async function getOrganizationTypes(): ActionResponsePromise<
  OrganizationTypeDto[]
> {
  const url = `${organizationGraphEndpoint}/types?parentTypeId=6&depth=1&depthOp=%3D
`;
  return getWithoutBody(url);
}

export async function putOrganizationGraph(
  requestBody: GraphDtoPutRequestBody<OrganizationDto>
): ActionResponsePromise<GraphDto<OrganizationDto>> {
  return putRequestWithDifferentReturnType<
    GraphDtoPutRequestBody<OrganizationDto>,
    GraphDto<OrganizationDto>
  >(requestBody, organizationGraphEndpoint);
}
export async function getCurriculumDeliveries(
  idList: number[]
): ActionResponsePromise<WorkSeriesBundleAssignmentDto[]> {
  const urlForDeliveries = `${SCHEMA_URL}/assignments/by-party-id`;
  return getDtoListByIds(idList, urlForDeliveries);
}

export async function getBundles(
  idList: string[]
): ActionResponsePromise<WorkSeriesSchemaBundleLeanDto[]> {
  const urlForBundlesContainingSchemasInList = `${SCHEMA_URL}/bundles/schema-id-list`;
  return getDtoListByIds(idList, urlForBundlesContainingSchemasInList);
}

const bundleApiEndpoint = `${SCHEMA_URL}/bundles`;

export async function putBundles(
  bundleList: WorkSeriesSchemaBundleLeanDto[]
): ActionResponsePromise<WorkSeriesSchemaBundleLeanDto[]> {
  return putEntities(bundleList, bundleApiEndpoint);
}
export async function postBundles(
  bundleList: WorkSeriesSchemaBundleLeanDto[]
): ActionResponsePromise<WorkSeriesSchemaBundleLeanDto[]> {
  return postEntities(bundleList, bundleApiEndpoint);
}
export async function deleteBundles(
  deleteBundleIds: number[]
): ActionResponsePromise<number[]> {
  return deleteEntities(deleteBundleIds, bundleApiEndpoint);
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
export async function postBundleDeliveries(
  bundleAssignments: LongLongTuple[]
): ActionResponsePromise<WorkSeriesBundleAssignmentDto[]> {
  const bundlePostUrl = `${SCHEMA_URL}/assignments`;
  return postEntitiesWithDifferentReturnType<
    LongLongTuple[],
    WorkSeriesBundleAssignmentDto[]
  >(bundleAssignments, bundlePostUrl);
}
