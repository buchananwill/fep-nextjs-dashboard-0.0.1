'use server';
import { generateBaseEndpointSet } from '../actions/template-endpoints';
import { WorkTaskTypeDto } from '../dtos/WorkTaskTypeDtoSchema';

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


