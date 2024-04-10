'use server';
import { generateBaseEndpointSet } from '../actions/template-endpoints';
import { CarouselOrderItemDto } from '../dtos/CarouselOrderItemDtoSchema';

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
  CarouselOrderItemDto,
  number
>(
  '/api/v2/carousels/orders/items'
);


