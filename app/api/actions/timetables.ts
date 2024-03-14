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
