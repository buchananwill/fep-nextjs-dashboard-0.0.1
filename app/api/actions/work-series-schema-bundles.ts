import { WorkSeriesSchemaBundleLeanDto } from '../dtos/WorkSeriesSchemaBundleLeanDtoSchema';
import { ActionResponsePromise } from './actionResponse';
import {
  deleteEntities,
  getDtoListByIds,
  getWithoutBody,
  postEntities,
  putEntities
} from './template-actions';
import { API_V2_URL, Page } from '../main';

const BUNDLES_ENDPOINT = `${API_V2_URL}/workProjectSeriesSchemas/bundles`;

export async function getBundlesBySchemaIdList(
  idList: string[]
): ActionResponsePromise<WorkSeriesSchemaBundleLeanDto[]> {
  const urlForBundlesContainingSchemasInList = `${BUNDLES_ENDPOINT}/withItemSchemaIdInList`;
  console.log(urlForBundlesContainingSchemasInList);

  return getDtoListByIds(idList, urlForBundlesContainingSchemasInList);
}

export async function getBundles(): ActionResponsePromise<
  Page<WorkSeriesSchemaBundleLeanDto>
> {
  return getWithoutBody(`${BUNDLES_ENDPOINT}?page=0&size=100`);
}

export async function putBundles(
  bundleList: WorkSeriesSchemaBundleLeanDto[]
): ActionResponsePromise<WorkSeriesSchemaBundleLeanDto[]> {
  return putEntities(bundleList, BUNDLES_ENDPOINT);
}

export async function postBundles(
  bundleList: WorkSeriesSchemaBundleLeanDto[]
): ActionResponsePromise<WorkSeriesSchemaBundleLeanDto[]> {
  return postEntities(bundleList, BUNDLES_ENDPOINT);
}

export async function deleteBundles(
  deleteBundleIds: number[]
): ActionResponsePromise<number[]> {
  return deleteEntities(deleteBundleIds, BUNDLES_ENDPOINT);
}
