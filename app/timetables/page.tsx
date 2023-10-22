import React from 'react';

import fetchSchedule from '../api/request-schedule';
import Timetable from './timetable';
import fetchResults from '../api/student-search';
import { Student } from '../tables/student-table';
import StudentSelector from './student-selector';

export default async function TimetablesPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  const dummyParams = { id: 234, q: '' };

  const schedule = await fetchSchedule(Number(searchParams.q));

  const students: Student[] = await fetchResults(dummyParams);

  return (
    <main>
      <div className="flex p-2 justify-center">
        <div className="max-w-lg mx-8 space-y-6">
          <StudentSelector students={students} />
        </div>
        <Timetable tableContents={schedule}></Timetable>
      </div>
    </main>
  );
}