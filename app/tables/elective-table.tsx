'use client';
import React from 'react';
import ElectiveCard, { ElectiveProps } from '../components/elective-card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow
} from '@tremor/react';

interface ElectiveTableProps {
  electives: ElectiveProps[][];
}

export default function ElectiveTable({ electives }: ElectiveTableProps) {
  return (
    <Table className=" m-2 p-2">
      <TableHead>
        <TableRow>
          <TableHeaderCell className="text-center">Carousel 1</TableHeaderCell>
          <TableHeaderCell className="text-center">Carousel 2</TableHeaderCell>
          <TableHeaderCell className="text-center">Carousel 3</TableHeaderCell>
          <TableHeaderCell className="text-center">Carousel 4</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {electives.map((arrayRow, rowIndex) => (
          <TableRow key={`row-${rowIndex}`}>
            {arrayRow.map((cell, cellIndex) => (
              <TableCell className="p-0" key={`cell-${rowIndex}-${cellIndex}`}>
                <ElectiveCard
                  key={`card-${rowIndex}-${cellIndex}`}
                  courseDescription={cell.courseDescription}
                  subscribers={cell.subscribers}
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
