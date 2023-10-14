import React from 'react';
import ElectiveTable from '../tables/elective-table';
import fetchElectiveCarouselTable from '../../pages/api/electives/request-elective-grid';

export default async function ElectivesPage() {
  const electiveData = await fetchElectiveCarouselTable(12);

  return (
    <div className="flex w-full p-2">
      <ElectiveTable electives={electiveData}></ElectiveTable>
      <div>A student list</div>
    </div>
  );
}
