'use server';
import { TimeDivisionDto } from '../dtos/TimeDivisionDtoSchema';
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
  TimeDivisionDto,
  number
>(
  '/api/v2/time/timeDivisions'
);


