import axios from 'axios';

interface SearchParams {
  id: number;
  // token: string
}

const apiBaseUrl = process.env.API_ACADEMIC_URL;

const fetchSchedule = async (searchId: number) => {
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

export default fetchSchedule;
