'use server';
import { generateBaseEndpointSet } from '../actions/template-endpoints';
import { CarouselDto } from '../dtos/CarouselDtoSchema';

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
  CarouselDto,
  string
>(
  '/api/v2/carouselGroups/carousels'
);


