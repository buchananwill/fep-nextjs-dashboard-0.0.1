import React from 'react';
import ElectiveTable from '../tables/elective-table';
import fetchElectiveCarouselTable from '../../pages/electives/request-elective-grid';

export default async function ElectivesPage() {
  const electiveData = await fetchElectiveCarouselTable(13);

  return (
    <div>
      <ElectiveTable electives={electiveData}></ElectiveTable>
    </div>
  );
}
