'use server';
import { OrganizationTypeDto } from '../dtos/OrganizationTypeDtoSchema';
import { generateBaseEndpointSet } from '../actions/template-base-endpoints';
import { generateGraphEndpointSet } from '../actions/template-graph-endpoints';

export const {
  getPage,
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
  '/api/v2/organizations'
);



export const { getGraph, getGraphByNodeList, getGraphByRootId, putGraph } =
 generateGraphEndpointSet<
  OrganizationTypeDto
>(
  '/api/v2/organizations/types'
);


