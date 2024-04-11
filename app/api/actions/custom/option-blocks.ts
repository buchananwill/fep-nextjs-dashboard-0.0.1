'use server';
import { API_ACADEMIC_URL } from '../../main';
import { ActionResponsePromise } from '../actionResponse';
import { CarouselGroupDto } from '../../dtos/CarouselGroupDtoSchema';
import { getWithoutBody } from '../template-actions';

export async function getOptionBlocks(): ActionResponsePromise<
  CarouselGroupDto[]
> {
  const fullUrl = `${API_ACADEMIC_URL}/carousel-groups`;

  return getWithoutBody(fullUrl);
}

export async function getCoAppearanceMatrix(
  yearGroupCohort: number
): ActionResponsePromise<number[][]> {
  const fullUrl = `${API_ACADEMIC_URL}/electives/coAppearanceMatrix?yearGroupCohort=${yearGroupCohort}`;
  return getWithoutBody(fullUrl);
}
