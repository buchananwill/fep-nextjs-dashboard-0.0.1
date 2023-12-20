'use client';
import { ReactNode, useContext, useState } from 'react';
import { SubjectColorCoding, SubjectColorCodingDispatch } from './context';
import { useColorState } from '../components/color-selector';
import { HUE_OPTIONS, LIGHTNESS_OPTIONS } from '../components/color-context';

const someSubjects = ['Maths', 'Art', 'Science'];

export default function SubjectColorCodingProvider({
  children
}: {
  children: ReactNode;
}) {
  const context = useContext(SubjectColorCoding);

  someSubjects.forEach(
    (subject) =>
      (context[subject] = {
        hue: HUE_OPTIONS[1],
        lightness: LIGHTNESS_OPTIONS[1]
      })
  );
  const [subjectColorCoding, setSubjectColorCoding] = useState(context);

  return (
    <SubjectColorCoding.Provider value={subjectColorCoding}>
      <SubjectColorCodingDispatch.Provider
        value={{ setSubjectColorCoding: setSubjectColorCoding }}
      >
        {children}
      </SubjectColorCodingDispatch.Provider>
    </SubjectColorCoding.Provider>
  );
}
