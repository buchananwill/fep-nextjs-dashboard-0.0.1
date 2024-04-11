'use server';
import { GraphDto } from '../zod-mods';
import { OrganizationDto } from '../dtos/OrganizationDtoSchema';
import { getWithoutBody } from './template-actions';
import { API_BASE_URL } from '../main';

const organizationGraphEndpoint = `${API_BASE_URL}/v2/organizations/graphs`;
export async function getOrganizationGraphByOrganizationType(typeId: number) {
  return getWithoutBody<GraphDto<OrganizationDto>>(
    `${organizationGraphEndpoint}/byOrganizationType/${typeId}`
  );
}
