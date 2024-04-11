'use server';
import { CarouselOptionDto } from '../dtos/CarouselOptionDtoSchema';
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
  CarouselOptionDto,
  number
>(
  '/api/v2/carouselGroups/carousels/options'
);


