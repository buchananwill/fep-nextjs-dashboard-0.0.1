'use server';
import { API_ACADEMIC_URL } from '../main';
import { ActionResponsePromise, successResponse } from './actionResponse';
import { CarouselGroupDto } from '../dtos/CarouselGroupDtoSchema';

export async function getOptionBlocks(): ActionResponsePromise<
  CarouselGroupDto[]
> {
  const fullUrl = `${API_ACADEMIC_URL}/carousel-groups`;

  console.log('Processing request...');
  console.log(fullUrl);

  try {
    const response = await fetch(fullUrl, { cache: 'no-store' });
    const carouselGroups: CarouselGroupDto[] = await response.json();
    return successResponse(carouselGroups);
  } catch (e) {
    return new Response('', { status: 500 });
  }
}
