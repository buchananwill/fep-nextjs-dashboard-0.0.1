'use server';
import { API_ACADEMIC_URL } from '../main';
import { LessonCycleDTO } from '../dto-interfaces';
import { ActionResponsePromise } from './actionResponse';
import { getWithoutBody } from './template-actions';

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

export async function swapPeriods(
  periodId: number,
  scheduleId: number
): Promise<LessonCycleDTO[]> {
  const response = await fetch('api', {
    method: 'PUT', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify([periodId, periodId, scheduleId])
  }); //PUT(periodId, periodId, scheduleId);

  return await response.json();
}
