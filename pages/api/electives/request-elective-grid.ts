import axios from 'axios';

interface SearchParams {
    yearGroupRank: number
    // token: string
}



const fetchElectiveCarouselTable = async (yearGroup : number) => {
  try {

    console.log("Current YearGroupRank: " + yearGroup)

    if (Number.isNaN(yearGroup)) return null;
    
    const response = await axios.get('http://localhost:8080/api/academic/electives', {
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
