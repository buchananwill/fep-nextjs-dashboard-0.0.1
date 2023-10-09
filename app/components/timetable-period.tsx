import React from 'react';

export interface CellInfo {
  principalValue: string;
  leftBottom: string;
  rightBottom: string;
}

interface TimetablePeriodProps {
  periodInfo: CellInfo;
}

function TimetablePeriod({ periodInfo }: TimetablePeriodProps) {
  const {
    principalValue: subject,
    leftBottom: teacher,
    rightBottom: location
  } = periodInfo;
  return (
    <div className="p-0 flex justify-center">
      <div className="p-1 justify-between text-center w-full border rounded m-0">
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
