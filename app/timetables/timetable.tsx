import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell
} from '@tremor/react';

import TimetablePeriod, { CellInfo } from './timetable-period';

interface TableContents {
  headerLabels: string[];
  tableRows: CellInfo[][];
}

export default function Timetable({
  tableContents
}: {
  tableContents: TableContents;
}) {
  if (tableContents == null)
    return (
      <div>
        <p>No table.</p>
      </div>
    );

  const { headerLabels, tableRows } = tableContents;

  const singleWeekLabels = headerLabels.slice(0, 6);

  const weekAHeader = singleWeekLabels.map((label) => ({
    principalValue: 'A',
    leftBottom: '',
    rightBottom: ''
  }));
  const weekBHeader = singleWeekLabels.map((label) => ({
    principalValue: 'B',
    leftBottom: '',
    rightBottom: ''
  }));

  const rowLabels = tableRows.map((row) => row.slice(0, 1));
  const weekARows = tableRows.map((row, index) => [
    ...rowLabels[index],
    ...row.slice(1, 6)
  ]);
  const weekBRows = tableRows.map((row, index) => [
    ...rowLabels[index],
    ...row.slice(6, 11)
  ]);
  const stackedRows = [weekAHeader, ...weekARows, weekBHeader, ...weekBRows];

  return (
    <Table className="max-w-4xl">
      <TableHead className="border">
        <TableRow>
          {singleWeekLabels.map((singleWeekLabels, index) => (
            <TableHeaderCell key={index} className="w-32 border">
              <p className="text-center">{singleWeekLabels}</p>
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {stackedRows.map((row, rowIndex) => (
          <TableRow key={`row-${rowIndex}`}>
            {row.map((cellInfo, cellIndex) => (
              <TableCell key={`cell-${rowIndex}-${cellIndex}`} className="p-0">
                <TimetablePeriod
                  key={`period-${rowIndex}-${cellIndex}`}
                  periodInfo={cellInfo}
                ></TimetablePeriod>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
