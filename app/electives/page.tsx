'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import ElectiveTable from '../tables/elective-table';
import fetchElectiveCarouselTable from '../../pages/api/electives/request-elective-grid';
import { fetchStudentsByPartyIDs } from '../../pages/api/students/student-search';
import { Button, Text, Title, Card } from '@tremor/react';
import { Student } from '../tables/student-table';

export default function ElectivesPage() {
  const [version, setVersion] = useState('stored');
  const [electiveData, setElectiveDate] = useState(null);
  const [studentList, setStudentList] = useState<Student[] | null>(null);
  const [carouselSubjectFocus, setCarouselSubjectFocus] =
    useState<string>('No subject focused');
  // const [dataLoading, setDataLoading] = useState(true);

  const handleButtonClick = () => {
    const updatedVersion = version == 'stored' ? 'default' : 'stored';
    setVersion(updatedVersion);
  };

  const handleCardClick = async (subject: string, studentIDlist: number[]) => {
    const updatedStudentList = await fetchStudentsByPartyIDs(studentIDlist);
    setStudentList(updatedStudentList);
    setCarouselSubjectFocus(subject);
    console.log(updatedStudentList);
  };

  useEffect(() => {
    async function doInitialFetch() {
      setElectiveDate(null);
      const result = await fetchElectiveCarouselTable({
        yearGroup: 12,
        version: version
      });
      if (!ignore) {
        setElectiveDate(result);
        // setDataLoading(false);
      }
    }
    let ignore = false;
    doInitialFetch();
    return () => {
      ignore = true;
    };
  }, [version]);

  // if (electiveData == null) {
  //   return <p>Loading...</p>;
  // }

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div className="flex w-full items-center justify-between">
        <Title>Carousel</Title>
        <Text>Carousel Subscription Analysis</Text>
        <Button onClick={handleButtonClick}>
          {version == 'stored' ? 'Stored' : 'Default'}
        </Button>
      </div>
      <div className="flex w-full items-top justify-between pt-4">
        <Card className="max-w-4xl">
          {electiveData == null ? (
            <p>Loading...</p>
          ) : (
            <ElectiveTable
              electives={electiveData}
              handleCardClick={handleCardClick}
            ></ElectiveTable>
          )}
        </Card>
        {studentList == null ? (
          <Card className="max-w-sm ml-2">Student List...</Card>
        ) : (
          <Card className="max-w-sm ml-2">
            <Title>{carouselSubjectFocus}</Title>
            <ol>
              {studentList.map((student) => (
                <li key={student.id}>{student.name}</li>
              ))}
            </ol>
          </Card>
        )}
      </div>
    </main>
  );
}
