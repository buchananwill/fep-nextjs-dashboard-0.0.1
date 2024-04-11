'use server';
import { OrganizationTypeDto } from '../dtos/OrganizationTypeDtoSchema';
import { generateGraphEndpointSet } from '../actions/template-graph-endpoints';
import { generateBaseEndpointSet } from '../actions/template-base-endpoints';

export const { getGraph, getGraphByNodeList, getGraphByRootId, putGraph } =
 generateGraphEndpointSet<
  OrganizationTypeDto
>(
  '/api/v2/organizations/types'
);



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
  OrganizationTypeDto,
  number
>(
  '/api/v2/organizations/types'
);


