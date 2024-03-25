'use server';
import { getWithoutBody, patchEntityList } from './template-actions';
import { ActionResponsePromise } from './actionResponse';
import { GraphDto } from '../zod-mods';
import { AssetDto } from '../dtos/AssetDtoSchema';
import { API_BASE_URL } from '../main';

const premisesUrl = `${API_BASE_URL}/assets/premises`;

export async function getPremises(): ActionResponsePromise<GraphDto<AssetDto>> {
  return await getWithoutBody(`${premisesUrl}/graph`);
}
export async function getPremisesWithRoot(
  rootName: string
): ActionResponsePromise<GraphDto<AssetDto>> {
  return await getWithoutBody(`${premisesUrl}/graph/byRootName/${rootName}`);
}

export async function patchPremises(premises: AssetDto[]) {
  return patchEntityList(premises, premisesUrl);
}
