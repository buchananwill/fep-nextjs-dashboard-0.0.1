import { LessonEnrollmentDTO } from '../../dto-interfaces';
import { API_ACADEMIC_URL } from '../../main';
import { getWithoutBody } from '../template-actions';
import { ActionResponsePromise } from '../actionResponse';

export const fetchLessonEnrollments = async (
  studentId: number,
  scheduleId: number
): ActionResponsePromise<LessonEnrollmentDTO[]> => {
  const fetchURL = `${API_ACADEMIC_URL}/get-lesson-enrollments/${scheduleId}?studentId=${studentId}`;
  return getWithoutBody(fetchURL);
};
