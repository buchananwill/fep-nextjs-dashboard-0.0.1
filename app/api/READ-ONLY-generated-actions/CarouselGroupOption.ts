'use server';
import { CarouselGroupOptionDto } from '../dtos/CarouselGroupOptionDtoSchema';
import { generateBaseEndpointSet } from '../actions/template-base-endpoints';
import { generateIntersectionEndpointSet } from '../actions/template-intersection-endpoints';

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
  CarouselGroupOptionDto,
  number
>(
  '/api/v2/carouselGroups/options'
);


export const {
  getByRowIdListAndColumnIdList,
  getColumnIdList,
  getByRowIdList,
  getIntersectionTable
} = generateIntersectionEndpointSet<
  CarouselGroupOptionDto,
  string,
  string
>(
  '/api/v2/carouselGroups/options'
);

