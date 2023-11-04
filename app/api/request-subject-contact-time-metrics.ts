import { revalidateTag } from 'next/cache';
import { AllSubjectsContactTimeDTO } from '../subjects/chart';
import { CacheSetting } from '../components/filter-dropdown';

const apiBaseUrl = process.env.API_ACADEMIC_URL;

export const fetchAllSubjectsContactTime =
  async (): Promise<AllSubjectsContactTimeDTO> => {
    const tag = 'subjectContactMetrics';

    // if (cacheSetting == 'reload') revalidateTag(tag);

    const fetchURL = `${apiBaseUrl}/all-subjects-contact-time`;

    try {
      const response = await fetch(fetchURL, {
        next: { revalidate: 60, tags: [tag] }, // Next collection tag for revalidation handling.
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
        return { allSubjects: [] };
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching data: ', error);
      return { allSubjects: [] };
    }
  };
