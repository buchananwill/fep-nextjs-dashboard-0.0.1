'use server';
import { ProviderRoleAvailabilityDto } from '../dtos/ProviderRoleAvailabilityDtoSchema';
import { generateBaseEndpointSet } from '../actions/template-base-endpoints';
import { generateIntersectionEndpointSet } from '../actions/template-intersection-endpoints';

export const {
  getPage,
  getAll,
  deleteIdList,
  postList,
  putList,
  getOne,
  postOne,
  putOne,
  deleteOne,
  getDtoListByBodyList,
  getDtoListByParamList,
  getDtoListByExampleList
} = generateBaseEndpointSet<
  ProviderRoleAvailabilityDto,
  number
>(
  '/api/v2/providerRoles/availabilities'
);


export const {
  getByRowIdListAndColumnIdList,
  getColumnIdList,
  getByRowIdList,
  getIntersectionTable
} = generateIntersectionEndpointSet<
  ProviderRoleAvailabilityDto,
  number,
  number
>(
  '/api/v2/providerRoles/availabilities'
);

