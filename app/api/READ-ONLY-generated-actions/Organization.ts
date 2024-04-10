'use server';
import { generateBaseEndpointSet } from '../actions/template-endpoints';
import { Long } from '../dtos/LongSchema';

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
  Long,
  number
>(
  '/api/v2/workProjectSeriesSchemas/bundleAssignments'
);


