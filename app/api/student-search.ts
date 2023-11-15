import axios from 'axios';
import { StudentDTO } from './dto-interfaces';

interface SearchParams {
  q: string;
  // token: string
}

const apiBaseUrl = process.env.API_ACADEMIC_URL;

export const fetchAllStudents = async (
  searchParams: SearchParams
): Promise<StudentDTO[]> => {
  const fetchUrl = `${apiBaseUrl}/students`;

  try {
    const response = await fetch(fetchUrl, {
      // next: { revalidate: 300, tags: [tag] }, // Next collection tag for revalidation handling.
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

export const fetchStudentsByPartyIDs = async (studentIDlist: number[]) => {
  const queryString = `${encodeURIComponent(JSON.stringify(studentIDlist))}`;

  try {
    const response = await axios.post(
      `${apiBaseUrl}/students-by-party-ids`,
      studentIDlist
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    return null;
  }
};

export default fetchAllStudents;
