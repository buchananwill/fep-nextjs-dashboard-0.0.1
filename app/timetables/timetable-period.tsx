import React from 'react';
import { ScheduleCellDTO } from '../api/dtos/ScheduleCellDTOSchema';

interface TimetablePeriodProps {
  periodInfo: ScheduleCellDTO;
}

function TimetablePeriod({ periodInfo }: TimetablePeriodProps) {
  const {
    principalValue: subject,
    leftBottom: teacher,
    rightBottom: location
  } = periodInfo;
  return (
    <div className="p-0 flex justify-center w-full">
      <div className="p-1 justify-between text-center w-full m-0">
        <p className="font-bold ">{subject}</p>
        <div className="flex justify-between">
          <p>{teacher}</p>
          <p>{location}</p>
        </div>
      </div>
    </div>
  );
}

export default TimetablePeriod;
