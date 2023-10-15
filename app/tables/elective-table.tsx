'use client';
import React, { MouseEventHandler } from 'react';
import ElectiveCard, { ElectiveDTO } from '../components/elective-card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow
} from '@tremor/react';

interface ElectiveTableData {
  electives: ElectiveDTO[][];
}

export default function ElectiveTable({
  electives,
  handleCardClick
}: {
  electives: ElectiveDTO[][];
  handleCardClick: Function;
}) {
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
                  electiveDTO={cell}
                  handleCardClick={handleCardClick}
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
