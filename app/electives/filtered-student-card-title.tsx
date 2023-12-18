'use client';
import React, { useContext } from 'react';
import { ElectiveContext } from './elective-context';

export function FilteredStudentCardTitle() {
  const { filterPending, filteredStudents } = useContext(ElectiveContext);
  return (
    <>
      Filtered Students : {filteredStudents.length}
      {filterPending && (
        <span className="absolute right-6 inset-y-1/3 loading loading-dots loading-xs z-20"></span>
      )}
    </>
  );
}
