const apiBaseUrl = process.env.API_ACADEMIC_URL;

export const fetchElectivePreferencesByPartyIds = async (studentIDlist: number[]) => {

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

  export const fetchElectiveYearGroupWithAllStudents = async (yearGroup:number) => {
    console.log(yearGroup, typeof yearGroup)

    const fetchURL = `http://localhost:8080/api/academic/electives-yeargroup-with-all-students?yearGroupIntRank=${yearGroup}`;

    console.log(fetchURL)


    try {
      const response = await fetch(fetchURL, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        // body: JSON.stringify(data), // body data type must match "Content-Type" header
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
  }
  

  