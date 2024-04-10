import { WorkSeriesSchemaBundleLeanDto } from '../dtos/WorkSeriesSchemaBundleLeanDtoSchema';
import { ActionResponsePromise } from './actionResponse';
import { getDtoListByIds } from './template-actions';
import { API_V2_URL } from '../main';

const BUNDLES_ENDPOINT = `${API_V2_URL}/workProjectSeriesSchemas/bundles`;

export async function getBundlesBySchemaIdList(
  idList: string[]
): ActionResponsePromise<WorkSeriesSchemaBundleLeanDto[]> {
  const urlForBundlesContainingSchemasInList = `${BUNDLES_ENDPOINT}/withItemSchemaIdInList`;
  console.log(urlForBundlesContainingSchemasInList);

  return getDtoListByIds(idList, urlForBundlesContainingSchemasInList);
}
