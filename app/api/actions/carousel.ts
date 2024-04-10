'use server';
import { generateBaseEndpointSet } from './template-endpoints';
import { CarouselDto } from '../dtos/CarouselDtoSchema';

export const { getPage, deleteIdList, postList, putList } =
  generateBaseEndpointSet<CarouselDto, string>(['carouselGroups', 'carousels']);
