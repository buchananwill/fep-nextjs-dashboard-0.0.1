import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text
} from '@tremor/react';

import TimetablePeriod, { PeriodInfo } from '../components/timetable-period';

interface TableContents {
  headerInfo: string[];
  rowInfo: PeriodInfo[][];
}

export default function Timetable({
  tableContents: { headerInfo, rowInfo }
}: {
  tableContents: TableContents;
}) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {headerInfo.map((headerLabel, index) => (
            <TableHeaderCell key={index}>
              <p className="text-center">{headerLabel}</p>
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rowInfo.map((row, rowIndex) => (
          <TableRow key={`row-${rowIndex}`}>
            {row.map((periodInfo, cellIndex) => (
              <TableCell key={`cell-${rowIndex}-${cellIndex}`}>
                <TimetablePeriod
                  key={`period-${rowIndex}-${cellIndex}`}
                  periodInfo={periodInfo}
                ></TimetablePeriod>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
