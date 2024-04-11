'use server';
import { AssetTypeDto } from '../dtos/AssetTypeDtoSchema';
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
  AssetTypeDto,
  number
>(
  '/api/v2/assets/types'
);



export const { getGraph, getGraphByNodeList, getGraphByRootId, putGraph } =
 generateGraphEndpointSet<
  AssetTypeDto
>(
  '/api/v2/assets/types'
);


