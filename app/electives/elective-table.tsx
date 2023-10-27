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

export default function OptionBlockTable({
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
          {electives[0].map((rowHeader, index) => (
            <TableHeaderCell key={index} className="text-center">
              Option Block {rowHeader.carouselId}
            </TableHeaderCell>
          ))}
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
