'use server';
import {
  getWithoutBody,
  patchEntityList,
  postIntersectionTableRequest,
  putEntities,
  putRequestWithDifferentReturnType
} from '../template-actions';
import { ActionResponsePromise } from '../actionResponse';
import { GraphDto, GraphDtoPutRequestBody } from '../../zod-mods';
import { AssetDto } from '../../dtos/AssetDtoSchema';
import { API_BASE_URL } from '../../main';
import { AssetRoleWorkTaskSuitabilityDto } from '../../dtos/AssetRoleWorkTaskSuitabilityDtoSchema';
export async function patchAssetRoleWorkTaskSuitabilities(
  suitabilityList: AssetRoleWorkTaskSuitabilityDto[]
) {
  return patchEntityList(
    suitabilityList,
    `${API_BASE_URL}/assets/assetRoleSuitabilities`
  );
}
