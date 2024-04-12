'use server';
import { API_ACADEMIC_URL, API_BASE_URL } from '../../main';
import { LessonCycleDTO } from '../../dto-interfaces';
import { ActionResponsePromise, successResponse } from '../actionResponse';
import { getWithoutBody, putEntities } from '../template-actions';

export const fetchScheduleIds = async (): ActionResponsePromise<number[]> => {
  const fetchURL = `${API_ACADEMIC_URL}/get-list-of-schedule-ids`;

  return getWithoutBody(fetchURL);
};
export const fetchAllLessonCycles = async (
  scheduleId: number
): ActionResponsePromise<LessonCycleDTO[]> => {
  const fetchURL = `${API_ACADEMIC_URL}/get-all-lesson-cycles?scheduleId=${scheduleId}`;

  return getWithoutBody(fetchURL);
};

// HACKED TO ALLOW REMOVAL OF OLD CODE. NOT FINISHED.
export async function swapPeriods(
  periodId: number,
  scheduleId: number
): ActionResponsePromise<LessonCycleDTO[]> {
  const fetchURL = `${API_BASE_URL}/swap-periods-in-schedule`;

  putEntities([periodId, periodId, scheduleId], fetchURL);

  return successResponse([]);
}
