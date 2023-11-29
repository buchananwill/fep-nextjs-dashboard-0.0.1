import axios from 'axios';
import { LessonCycleDTO, Period, TabularDTO } from '../../api/dto-interfaces';
import { ElectiveState } from '../../electives/elective-reducers';

interface SearchParams {
  id: number;
  // token: string
}

const apiBaseUrl = process.env.API_ACADEMIC_URL;

export const fetchSchedule = async (searchId: number) => {
  try {
    if (Number.isNaN(searchId)) return null;

    const response = await axios.get(`${apiBaseUrl}/schedules`, {
      params: { id: searchId }
      // headers: {
      //     'Authorization': `Bearer ${searchParams.token}`
      // }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    return null;
  }
};

export const fetchAllPeriodsInCycle = async (): Promise<
  TabularDTO<string, Period>
> => {
  const fetchURL = `${apiBaseUrl}/get-all-periods-in-cycle`;

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

    return response.json();
  } catch (error) {
    console.error('Error fetching data: ', error);
    return {
      numberOfColumns: 0,
      numberOfRows: 0,
      cellDataAndMetaData: [],
      headerData: []
    };
  }
};

const hotSchedule = 1152;
export const fetchAllLessonCycles = async (): Promise<LessonCycleDTO[]> => {
  const fetchURL = `${apiBaseUrl}/get-all-lesson-cycles?id=${hotSchedule}`;

  try {
    const response = await fetch(fetchURL, {
      // next: { revalidate: 60, tags: [tag] }, // Next collection tag for revalidation handling.
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'reload', // *default, no-cache, reload, force-cache, only-if-cached
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

export const swapTwoPeriods = async (periodId1: number, periodId2: number) => {
  const tag = 'electiveAssignments';

  const swapObject = [periodId1, periodId2, hotSchedule];

  const fetchURL = `http://localhost:8080/api/academic/swap-periods-in-schedule`;

  console.log('fetchURL ', fetchURL);

  console.log(swapObject);

  try {
    const response = await fetch(fetchURL, {
      // next: { tags: [tag] }, // Next collection tag for revalidation handling.
      method: 'PUT', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'reload', //cacheSetting *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(swapObject) // body data type must match "Content-Type" header
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
