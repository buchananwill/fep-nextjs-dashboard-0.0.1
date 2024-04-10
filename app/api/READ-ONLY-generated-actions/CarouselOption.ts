'use server';
import { generateBaseEndpointSet } from '../actions/template-endpoints';
import { CarouselOptionDto } from '../dtos/CarouselOptionDtoSchema';

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


