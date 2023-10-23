import axios from 'axios';

interface SearchParams {
    id: number
    // token: string
}



const fetchSchedule = async (searchId : number) => {
  try {

    

    if (Number.isNaN(searchId)) return null;
    
    const response = await axios.get('http://localhost:8080/api/academic/schedules', {
      params: { id: searchId} ,
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
