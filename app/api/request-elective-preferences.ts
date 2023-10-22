const apiBaseUrl = process.env.API_ACADEMIC_URL;

export const fetchElectivePreferencesByPartyIds = async (studentIDlist: number[]) => {
    console.log(studentIDlist)
    console.log(apiBaseUrl)

    try {
      const queryString = studentIDlist.map(id => `partyIds=${id}`).join('&')
      const response = await fetch(`${apiBaseUrl}elective-preferences-by-party-ids?${queryString}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

        },
      });
  
      if (!response.ok) {
        console.error(`Error fetching data: HTTP ${response.status}`);
        return null;
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data: ', error);
      return null;
    }
  };
  

  