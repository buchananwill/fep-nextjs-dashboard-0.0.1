import axios from 'axios';

// interface SearchParams {
//     id: number
//     // token: string
// }



const fetchClassRooms = async () => {
  try {
    
    const response = await axios.post('http://localhost:8080/api/academic/class-rooms', {
      params: { } ,
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
