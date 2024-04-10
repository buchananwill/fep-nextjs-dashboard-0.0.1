'use server';
import { generateBaseEndpointSet } from '../actions/template-endpoints';
import { CarouselGroupOptionDto } from '../dtos/CarouselGroupOptionDtoSchema';

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


