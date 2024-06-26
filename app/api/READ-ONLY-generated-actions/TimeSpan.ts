'use server';
import { TimeSpanDto } from '../dtos/TimeSpanDtoSchema';
import { generateBaseEndpointSet } from '../actions/template-base-endpoints';

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
  TimeSpanDto,
  number
>(
  '/api/v2/time/cycleSubspans/types'
);


