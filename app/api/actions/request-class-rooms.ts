import { getWithoutBody } from './template-actions';
import { ActionResponsePromise } from './actionResponse';
import { GraphDto } from '../zod-mods';
import { AssetDto } from '../dtos/AssetDtoSchema';

const apiBaseUrl = process.env.API_ACADEMIC_URL;

export async function fetchPremises(): ActionResponsePromise<
  GraphDto<AssetDto>
> {
  return await getWithoutBody(`${apiBaseUrl}/premises`);
}
