'use server';
import { revalidatePath, revalidateTag } from 'next/cache';

import { ElectiveState } from '../electives/elective-reducers';
import { redirect } from 'next/navigation';

const apiBaseUrl = process.env.API_ACADEMIC_URL;

const aLevelClassLimit = process.env.A_LEVEL_CLASS_LIMIT;

const aLevelClassLimitInt = aLevelClassLimit ? parseInt(aLevelClassLimit) : -1;

export const getALevelClassLimitInt = (): number => {
  return 25;
};

export const fetchElectivePreferencesByPartyIds = async (
  studentIDlist: number[]
) => {
  try {
    const queryString = studentIDlist.map((id) => `partyIds=${id}`).join('&');
    const response = await fetch(
      `${apiBaseUrl}elective-preferences-by-party-ids?${queryString}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      console.error(`Error fetching data: HTTP ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    return null;
  }
};

export const fetchElectiveYearGroupWithAllStudents = async (
  yearGroup: number,
  cacheSetting: RequestCache
) => {
  const tag = 'electives';

  if (cacheSetting == 'reload') revalidateTag(tag);

  const fetchURL = `http://localhost:8080/api/academic/electives-yeargroup-with-all-students/${yearGroup}`;

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
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    return null;
  }
};

export const updateElectiveAssignments = async (
  electivesState: ElectiveState
) => {
  const tag = 'electiveAssignments';

  const fetchURL = `http://localhost:8080/api/academic/electives/option-block-assignments`;

  try {
    const response = await fetch(fetchURL, {
      next: { tags: [tag] }, // Next collection tag for revalidation handling.
      method: 'PUT', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      // cache: cacheSetting, // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(electivesState.electivePreferences) // body data type must match "Content-Type" header
    });

    if (!response.ok) {
      console.error(`Error fetching data: HTTP ${response.status}`);
      return null;
    }

    const data = await response.json();

    // revalidatePath("/electives/") // Update cached posts
    // redirect(redirectUrl) // Navigate to new route

    return data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    return null;
  }
};
