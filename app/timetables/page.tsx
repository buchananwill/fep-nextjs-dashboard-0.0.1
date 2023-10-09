import React from 'react';
import TimetablePeriod from '../components/timetable-period';
import Timetable from '../tables/timetable';

const dummyPeriod = {
  subject: 'Music',
  teacher: 'WWB',
  location: 'Q88'
};

const dummyTimetable = {
  headerInfo: ['Monday', 'Tuesday'],
  rowInfo: [
    [
      { subject: 'Music', teacher: 'WWB', location: 'Q88' },
      { subject: 'English', teacher: 'CJT', location: 'L66' }
    ],
    []
  ]
};

export default function TimetablesPage() {
  return (
    <main>
      <div>
        <Timetable tableContents={dummyTimetable}></Timetable>
      </div>
    </main>
  );
}
