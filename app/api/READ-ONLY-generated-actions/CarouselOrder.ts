'use server';
import { CarouselOrderDto } from '../dtos/CarouselOrderDtoSchema';
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
  CarouselOrderDto,
  string
>(
  '/api/v2/carouselGroups/orders'
);


