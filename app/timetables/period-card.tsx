'use client';
import { CellDataTransformer } from '../components/dynamic-dimension-timetable';
import { Period } from '../api/dto-interfaces';
import React, { useContext } from 'react';
import InteractiveTableCard from '../components/interactive-table-card';
import {
  TimetablesContext,
  TimetablesDispatchContext
} from './timetables-context';

export const PeriodCardTransformer: CellDataTransformer<Period> = ({
  data
}) => {
  const timetablesState = useContext(TimetablesContext);
  const dispatch = useContext(TimetablesDispatchContext);
  const handleCardClick = () => {
    dispatch({
      type: 'setPeriod',
      periodId: data.periodId
    });
  };

  return (
    <InteractiveTableCard
      decorationColor="blue"
      additionalClassNames={['border-transparent', 'items-center']}
    >
      <div
        className="flex w-full h-full justify-between pr-2"
        onClick={() => handleCardClick()}
      >
        <p>{data.startTime?.substring(0, 5)}</p>
        <p> {(data.periodId || 0) % 6 || 6}</p>
      </div>
    </InteractiveTableCard>
  );
};
