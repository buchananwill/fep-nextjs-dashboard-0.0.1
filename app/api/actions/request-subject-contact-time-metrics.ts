import { revalidateTag } from 'next/cache';
import { CacheSetting } from '../../components/filter-dropdown';
import { NamedNumberRecord } from '../dto-interfaces';
import { AllSubjectsContactTimeDTO } from '../dtos/AllSubjectsContactTimeDTOSchema';
import { getWithoutBody } from './template-actions';
import { ActionResponsePromise } from './actionResponse';

const apiBaseUrl = process.env.API_ACADEMIC_URL;

export const fetchAllSubjectsContactTime =
  async (): ActionResponsePromise<AllSubjectsContactTimeDTO> => {
    const tag = 'subjectContactMetrics';

    const fetchURL = `${apiBaseUrl}/all-subjects-contact-time`;

    return getWithoutBody(fetchURL);
  };

export const fetchSingleSubjectByYearGroupContactTime = async (
  subjectName: string
): ActionResponsePromise<NamedNumberRecord> => {
  const tag = `singleSubjectContactMetrics${subjectName}`;

  // if (cacheSetting == 'reload') revalidateTag(tag);

  const fetchURL = `${apiBaseUrl}/single-subject-per-year-group-contact-time?subjectName=${subjectName}`;

  return getWithoutBody(fetchURL);
};

export const fetchAllSubjectsByYearGroupContactTime =
  async (): ActionResponsePromise<NamedNumberRecord[]> => {
    const tag = `allSubjectContactMetrics`;

    // if (cacheSetting == 'reload') revalidateTag(tag);

    const fetchURL = `${apiBaseUrl}/all-subjects-per-year-group-contact-time`;

    return getWithoutBody(fetchURL);
  };
