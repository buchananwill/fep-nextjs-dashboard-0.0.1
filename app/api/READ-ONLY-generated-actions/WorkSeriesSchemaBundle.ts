'use server';
import { WorkSeriesSchemaBundleDto } from '../dtos/WorkSeriesSchemaBundleDtoSchema';
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
  WorkSeriesSchemaBundleDto,
  number
>(
  '/api/v2/workProjectSeriesSchemas/bundles'
);


