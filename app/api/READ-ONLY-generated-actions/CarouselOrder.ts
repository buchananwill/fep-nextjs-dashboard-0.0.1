'use server';
import { generateBaseEndpointSet } from '../actions/template-endpoints';
import { CarouselOrderDto } from '../dtos/CarouselOrderDtoSchema';

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
  CarouselOrderDto,
  string
>(
  '/api/v2/carouselGroups/orders'
);


