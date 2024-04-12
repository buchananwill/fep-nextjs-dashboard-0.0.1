'use server';
import { CycleSubspanGroupDto } from '../dtos/CycleSubspanGroupDtoSchema';
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
  CycleSubspanGroupDto,
  number
>(
  '/api/v2/time/cycleSubspanGroups'
);


