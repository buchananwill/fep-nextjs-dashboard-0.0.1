import axios from 'axios';

interface SearchParams {
    q: string
    // token: string
}



const fetchResults = async (searchParams : SearchParams) => {
  try {
    
    const response = await axios.get('http://localhost:8080/api/academic/students', {
      params: { q: searchParams.q} ,
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

export default fetchResults;
