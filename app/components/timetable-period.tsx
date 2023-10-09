import React from 'react';

export interface PeriodInfo {
  subject: string;
  teacher: string;
  location: string;
}

interface TimetablePeriodProps {
  periodInfo: PeriodInfo;
}

function TimetablePeriod({ periodInfo }: TimetablePeriodProps) {
  const { subject, teacher, location } = periodInfo;
  return (
    <div className="flex justify-center">
      <div className="p-0.5 justify-between text-center w-20">
        <p>{subject}</p>
        <div className="flex justify-between">
          <p>{teacher}</p>
          <p>{location}</p>
        </div>
      </div>
    </div>
  );
}

export default TimetablePeriod;
