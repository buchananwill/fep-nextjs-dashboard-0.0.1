'use client';

import React from 'react';

import { usePathname, useRouter } from 'next/navigation';
import { useTransition, useState } from 'react';
import { Select, SelectItem } from '@tremor/react';
import { StudentDTO } from '../api/dtos/StudentDTOSchema';

export default function StudentSelector({
  students
}: {
  students: StudentDTO[];
}) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState('');

  function handleSelect(selection: string) {
    const params = new URLSearchParams(window.location.search);

    if (selection) {
      params.set('q', selection);
      setValue(selection);
    } else {
      params.delete('q');
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div>
      <Select
        value={value}
        onValueChange={(e) => handleSelect(e)}
        className="w-48"
      >
        {students.map((student) => (
          <SelectItem
            value={`${student.id}`}
            key={`select-student${student.id}`}
          >
            {student.name}
          </SelectItem>
        ))}
      </Select>

      {isPending && (
        <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
