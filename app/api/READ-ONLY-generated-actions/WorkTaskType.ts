'use server';
import { WorkTaskTypeDto } from '../dtos/WorkTaskTypeDtoSchema';
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
  WorkTaskTypeDto,
  number
>(
  '/api/v2/workTaskTypes'
);



export const { getGraph, getGraphByNodeList, getGraphByRootId, putGraph } =
 generateGraphEndpointSet<
  WorkTaskTypeDto
>(
  '/api/v2/workTaskTypes'
);


