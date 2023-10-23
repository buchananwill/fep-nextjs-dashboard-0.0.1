import axios from 'axios';

interface SearchParams {
    yearGroup: number
    version: string
    // token: string
}



const fetchElectiveCarouselTable = async ({yearGroup, version } : SearchParams) => {
  try {

    const url = `http://localhost:8080/api/academic/electives-${version}` 

    if (Number.isNaN(yearGroup)) return null;
    
    const response = await axios.get(url, {
      params: { yearGroup: yearGroup} ,
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

export default fetchElectiveCarouselTable;
