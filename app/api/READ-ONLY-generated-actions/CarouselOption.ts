'use server';
import { CarouselOptionDto } from '../dtos/CarouselOptionDtoSchema';
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
  CarouselOptionDto,
  number
>(
  '/api/v2/carouselGroups/carousels/options'
);


export const {
  getByRowIdListAndColumnIdList,
  getColumnIdList,
  getByRowIdList,
  getIntersectionTable
} = generateIntersectionEndpointSet<
  CarouselOptionDto,
  string,
  string
>(
  '/api/v2/carouselGroups/carousels/options'
);

