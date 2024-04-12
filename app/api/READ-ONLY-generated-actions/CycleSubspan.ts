'use server';
import { CycleSubspanDto } from '../dtos/CycleSubspanDtoSchema';
import { generateBaseEndpointSet } from '../actions/template-base-endpoints';
import { generateWithTypeEndpointSet } from '../actions/template-type-endpoints';

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
  CycleSubspanDto,
  number
>(
  '/api/v2/time/cycleSubspans'
);


export const { getByTypeIdList } = generateWithTypeEndpointSet<CycleSubspanDto>(
  '/api/v2/time/cycleSubspans'
);

