'use server';
import { ProviderRoleDto } from '../dtos/ProviderRoleDtoSchema';
import { generateBaseEndpointSet } from '../actions/template-base-endpoints';
import { generateWithTypeEndpointSet } from '../actions/template-type-endpoints';

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
  ProviderRoleDto,
  number
>(
  '/api/v2/providerRoles'
);


export const { getByTypeIdList } = generateWithTypeEndpointSet<ProviderRoleDto>(
  '/api/v2/providerRoles'
);

