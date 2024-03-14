import axios from 'axios';
import { StudentDTO } from '../dtos/StudentDTOSchema';
import { API_ACADEMIC_URL } from '../main';
import { getWithoutBody } from './template-actions';
import { ActionResponsePromise } from './actionResponse';

interface SearchParams {
  q: string;
  // token: string
}

export const fetchAllStudents = async (
  searchParams?: SearchParams
): ActionResponsePromise<StudentDTO[]> => {
  const fetchUrl = `${API_ACADEMIC_URL}/students${
    searchParams?.q ? '?q=' + searchParams.q : ''
  }`;

  return getWithoutBody(fetchUrl);
};

export default fetchAllStudents;
