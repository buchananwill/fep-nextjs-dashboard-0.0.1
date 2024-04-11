'use server';
import { AssetDto } from '../dtos/AssetDtoSchema';
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
  AssetDto,
  number
>(
  '/api/v2/assets'
);


export const { getByTypeIdList } = generateWithTypeEndpointSet<AssetDto>(
  '/api/v2/assets'
);


export const { getGraph, getGraphByNodeList, getGraphByRootId, putGraph } =
 generateGraphEndpointSet<
  AssetDto
>(
  '/api/v2/assets'
);


