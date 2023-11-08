import axios from 'axios';
import { LessonCycleDTO, Period, TabularDTO } from './dto-interfaces';

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

export const fetchAllLessonCycles = async (): Promise<LessonCycleDTO[]> => {
  const fetchURL = `${apiBaseUrl}/get-all-lesson-cycles`;

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
    return [];
  }
};
