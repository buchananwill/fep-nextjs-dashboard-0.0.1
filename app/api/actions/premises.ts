'use server';
import { getWithoutBody, patchEntityList } from './template-actions';
import { ActionResponsePromise } from './actionResponse';
import { GraphDto } from '../zod-mods';
import { AssetDto } from '../dtos/AssetDtoSchema';
import { API_BASE_URL } from '../main';

const premisesUrl = `${API_BASE_URL}/assets/premises`;

export async function fetchPremises(): ActionResponsePromise<
  GraphDto<AssetDto>
> {
  return await getWithoutBody(`${premisesUrl}/graph`);
}

export async function patchPremises(premises: AssetDto[]) {
  return patchEntityList(premises, premisesUrl);
}
