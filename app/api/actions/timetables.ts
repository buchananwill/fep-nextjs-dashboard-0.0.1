import { API_ACADEMIC_URL } from '../main';
import { LessonCycleDTO } from '../dto-interfaces';

export const fetchScheduleIds = async (): Promise<number[]> => {
  const fetchURL = `${API_ACADEMIC_URL}/get-list-of-schedule-ids`;

  try {
    const response = await fetch(fetchURL, {
      // next: { revalidate: 60, tags: [tag] }, // Next collection tag for revalidation handling.
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-store', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      // body: JSON.stringify(data), // body data type must match "Content-Type" header
    });

    return response.json();
  } catch (error) {
    console.error('Error fetching data: ', error);
    return [];
  }
};
export const fetchAllLessonCycles = async (
  scheduleId: number
): Promise<LessonCycleDTO[]> => {
  const fetchURL = `${API_ACADEMIC_URL}/get-all-lesson-cycles?scheduleId=${scheduleId}`;

  try {
    const response = await fetch(fetchURL, {
      // next: { revalidate: 60, tags: [tag] }, // Next collection tag for revalidation handling.
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      // body: JSON.stringify(data), // body data type must match "Content-Type" header
    });

    if (response.status != 200) {
      console.error(response);
      return [];
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching data: ', error);
    return [];
  }
};
