'use server';
import { ProviderRoleTypeWorkTaskTypeSuitabilityDto } from '../dtos/ProviderRoleTypeWorkTaskTypeSuitabilityDtoSchema';
import { generateBaseEndpointSet } from '../actions/template-base-endpoints';
import { generateTriIntersectionEndpointSet } from '../actions/template-tri-intersection-endpoints';

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
  getDtoListByParamList
} = generateBaseEndpointSet<
  ProviderRoleTypeWorkTaskTypeSuitabilityDto,
  number
>(
  '/api/v2/workTaskType/providerRoleTypeSuitability'
);



export const {
  getByRowIdListAndColumnIdListAndLayerId,
  getByRowIdListAndLayerId,
  getColumnIdListAndLayerId,
  getTriIntersectionTable
} = generateTriIntersectionEndpointSet<
  ProviderRoleTypeWorkTaskTypeSuitabilityDto,
  number,
  number,
  number
>('/api/v2/workTaskType/providerRoleTypeSuitability');

