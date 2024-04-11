'use server';
import { ProviderRoleTypeDto } from '../dtos/ProviderRoleTypeDtoSchema';
import { generateBaseEndpointSet } from '../actions/template-base-endpoints';
import { generateGraphEndpointSet } from '../actions/template-graph-endpoints';

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
  ProviderRoleTypeDto,
  number
>(
  '/api/v2/providerRoles'
);



export const { getGraph, getGraphByNodeList, getGraphByRootId, putGraph } =
 generateGraphEndpointSet<
  ProviderRoleTypeDto
>(
  '/api/v2/providerRoles/types'
);


