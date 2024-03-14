import { BuildMetricDto } from '../dtos/BuildMetricDtoSchema';
import { API_ACADEMIC_URL } from '../main';
import { getWithoutBody } from './template-actions';
import { ActionResponsePromise } from './actionResponse';
import { NameIdStringTuple } from '../dtos/NameIdStringTupleSchema';
import { LessonCycleMetricSummaryDTO } from '../dtos/LessonCycleMetricSummaryDTOSchema';

export const fetchBuildMetricDto = async (
  scheduleId: number
): ActionResponsePromise<BuildMetricDto> => {
  const fetchURL = `${API_ACADEMIC_URL}/get-build-metric-dto?scheduleId=${scheduleId}`;
  return getWithoutBody(fetchURL);
};

export async function getLessonCycleMetricsWithInfinityCosts(
  schedule: string
): ActionResponsePromise<NameIdStringTuple[]> {
  const urlForSeriesIdList = `${API_ACADEMIC_URL}/get-list-of-lesson-cycle-metrics-with-infinity-costs?scheduleId=${schedule}`;
  return await getWithoutBody(urlForSeriesIdList);
}

export async function getLessonCycleBuildMetricSummary(
  lessonCycleId: string
): ActionResponsePromise<LessonCycleMetricSummaryDTO> {
  const urlForIndividualLessonCycleMetricSummary = `${API_ACADEMIC_URL}/get-lesson-cycle-build-metric-summary?lessonCycleId=${lessonCycleId}`;
  return await getWithoutBody(urlForIndividualLessonCycleMetricSummary);
}
