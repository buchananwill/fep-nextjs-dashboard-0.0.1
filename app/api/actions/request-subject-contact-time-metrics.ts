import { revalidateTag } from 'next/cache';
import { CacheSetting } from '../../components/filter-dropdown';
import { NamedNumberRecord } from '../dto-interfaces';
import { AllSubjectsContactTimeDTO } from '../dtos/AllSubjectsContactTimeDTOSchema';

const apiBaseUrl = process.env.API_ACADEMIC_URL;

export const fetchAllSubjectsContactTime =
  async (): Promise<AllSubjectsContactTimeDTO> => {
    const tag = 'subjectContactMetrics';

    // if (cacheSetting == 'reload') revalidateTag(tag);

    const fetchURL = `${apiBaseUrl}/all-subjects-contact-time`;

    try {
      const response = await fetch(fetchURL, {
        next: { revalidate: 300, tags: [tag] }, // Next collection tag for revalidation handling.
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        // cache: cacheSetting, // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        // body: JSON.stringify(data), // body data type must match "Content-Type" header
      });

      if (!response.ok) {
        console.error(`Error fetching data: HTTP ${response.status}`);
        return { allItems: [] };
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching data: ', error);
      return { allItems: [] };
    }
  };

export const fetchSingleSubjectByYearGroupContactTime = async (
  subjectName: string
): Promise<NamedNumberRecord> => {
  const tag = `singleSubjectContactMetrics${subjectName}`;

  // if (cacheSetting == 'reload') revalidateTag(tag);

  const fetchURL = `${apiBaseUrl}/single-subject-per-year-group-contact-time?subjectName=${subjectName}`;

  try {
    const response = await fetch(fetchURL, {
      next: { revalidate: 300, tags: [tag] }, // Next collection tag for revalidation handling.
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      // cache: cacheSetting, // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      // body: JSON.stringify(data), // body data type must match "Content-Type" header
    });

    if (!response.ok) {
      console.error(`Error fetching data: HTTP ${response.status}`);
      return { name: '', stringIntegerMap: {} };
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching data: ', error);
    return { name: '', stringIntegerMap: {} };
  }
};

export const fetchAllSubjectsByYearGroupContactTime = async (): Promise<
  NamedNumberRecord[]
> => {
  const tag = `allSubjectContactMetrics`;

  // if (cacheSetting == 'reload') revalidateTag(tag);

  const fetchURL = `${apiBaseUrl}/all-subjects-per-year-group-contact-time`;

  try {
    const response = await fetch(fetchURL, {
      next: { revalidate: 300, tags: [tag] }, // Next collection tag for revalidation handling.
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      // cache: cacheSetting, // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      // body: JSON.stringify(data), // body data type must match "Content-Type" header
    });

    if (!response.ok) {
      console.error(`Error fetching data: HTTP ${response.status}`);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching data: ', error);
    return [];
  }
};
