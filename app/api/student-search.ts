import axios from 'axios';

interface SearchParams {
    q: string
    // token: string
}





export const fetchResults = async (searchParams : SearchParams) => {
  try {
    
    const response = await axios.get('http://localhost:8080/api/academic/students', {
      params: { q: searchParams.q} ,
      // headers: { password: credentials.password}    
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

export const fetchStudentsByPartyIDs = async (studentIDlist : number[]) => {
    const queryString = `${encodeURIComponent(JSON.stringify(studentIDlist))}`;

  try {

    const response = await axios.post('http://localhost:8080/api/academic/students-by-party-ids', studentIDlist)

    return response.data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    return null;
  }
}

export default fetchResults;
