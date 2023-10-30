import axios from 'axios';

// interface SearchParams {
//     id: number
//     // token: string
// }

const apiBaseUrl = process.env.API_ACADEMIC_URL;

const fetchClassRooms = async () => {
  try {
    const response = await axios.post(`${apiBaseUrl}/class-rooms`, {
      params: {}
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

export default fetchClassRooms;
