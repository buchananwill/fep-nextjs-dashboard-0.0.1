'use server';
import { ActionResponsePromise } from './actionResponse';
import { GraphDto, GraphDtoPutRequestBody } from '../zod-mods';
import { OrganizationDto } from '../dtos/OrganizationDtoSchema';
import {
  getWithoutBody,
  putRequestWithDifferentReturnType
} from './template-actions';
import { API_BASE_URL } from '../main';
import { OrganizationTypeDto } from '../dtos/OrganizationTypeDtoSchema';

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

export async function getOrganizationGraphByOrganizationType(typeId: number) {
  return getWithoutBody<GraphDto<OrganizationDto>>(
    `${organizationGraphEndpoint}/byOrganizationType/${typeId}`
  );
}

export async function getOrganizationTypes(): ActionResponsePromise<
  GraphDto<OrganizationTypeDto>
> {
  const url = `${API_BASE_URL}/v2/organizations/types/graphs/byRootId/6?depth=0&depthOp=%3E
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
