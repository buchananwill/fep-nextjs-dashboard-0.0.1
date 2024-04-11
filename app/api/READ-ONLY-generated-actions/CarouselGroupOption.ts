'use server';
import { CarouselGroupOptionDto } from '../dtos/CarouselGroupOptionDtoSchema';
import { generateBaseEndpointSet } from '../actions/template-base-endpoints';

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
  CarouselGroupOptionDto,
  number
>(
  '/api/v2/carouselGroups/options'
);


