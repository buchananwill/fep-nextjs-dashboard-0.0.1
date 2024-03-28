'use server';
import {
  getWithoutBody,
  patchEntityList,
  postIntersectionTableRequest
} from './template-actions';
import { ActionResponsePromise } from './actionResponse';
import { GraphDto } from '../zod-mods';
import { AssetDto } from '../dtos/AssetDtoSchema';
import { API_BASE_URL } from '../main';
import { AssetRoleWorkTaskSuitabilityDto } from '../dtos/AssetRoleWorkTaskSuitabilityDtoSchema';

const premisesUrl = `${API_BASE_URL}/assets/premises`;

export async function getPremises(): ActionResponsePromise<GraphDto<AssetDto>> {
  return await getWithoutBody(`${premisesUrl}/graph`);
}
export async function getPremisesWithRoot(
  rootId: string
): ActionResponsePromise<GraphDto<AssetDto>> {
  return await getWithoutBody(`${premisesUrl}/graph/byRootId/${rootId}`);
}

export async function patchPremises(premises: AssetDto[]) {
  return patchEntityList(premises, premisesUrl);
}

export async function getAssetSuitabilities(
  assetIdList: number[],
  workTaskTypeIdList: number[]
) {
  return postIntersectionTableRequest<
    number,
    number,
    AssetRoleWorkTaskSuitabilityDto
  >({
    idsForHasIdTypeT: assetIdList,
    idsForHasIdTypeU: workTaskTypeIdList,
    url: `${API_BASE_URL}/assets/assetRoleSuitabilities/intersectionTable`
  });
}
