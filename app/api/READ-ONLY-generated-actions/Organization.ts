'use server';
import { OrganizationDto } from '../dtos/OrganizationDtoSchema';
import { generateBaseEndpointSet } from '../actions/template-base-endpoints';
import { generateWithTypeEndpointSet } from '../actions/template-type-endpoints';
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
  OrganizationDto,
  number
>(
  '/api/v2/organizations'
);


export const { getByTypeIdList } = generateWithTypeEndpointSet<OrganizationDto>(
  '/api/v2/organizations'
);


export const { getGraph, getGraphByNodeList, getGraphByRootId, putGraph } =
 generateGraphEndpointSet<
  OrganizationDto
>(
  '/api/v2/organizations'
);


