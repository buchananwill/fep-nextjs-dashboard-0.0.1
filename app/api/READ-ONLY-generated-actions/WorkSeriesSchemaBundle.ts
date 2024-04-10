'use server';
import { generateBaseEndpointSet } from '../actions/template-endpoints';
import { WorkSeriesSchemaBundleLeanDto } from '../dtos/WorkSeriesSchemaBundleLeanDtoSchema';

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
  WorkSeriesSchemaBundleLeanDto,
  number
>(
  '/api/v2/workProjectSeriesSchemas/bundles'
);


