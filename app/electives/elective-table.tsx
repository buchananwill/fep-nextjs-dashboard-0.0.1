import ElectiveCard, { ElectiveDTO } from './elective-card';
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
  partyId
}: {
  electives: ElectiveDTO[][];
  partyId: number;
}) {
  return (
    <Table className=" m-2 p-2 overflow-visible">
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
                  partyId={partyId}
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
