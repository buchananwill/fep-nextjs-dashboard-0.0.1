import { TableCellData, reconstructTableWithDimensions } from '../utils/tables';
import ElectiveCard, { ElectiveDTO } from './elective-card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow
} from '@tremor/react';

export default function ElectiveTable({
  electives,
  partyId,
  rows,
  cols
}: {
  electives: ElectiveDTO[];
  partyId: number;
  rows: number;
  cols: number;
}) {
  const tableCellsData: TableCellData[] = electives.map((elective) => ({
    row: elective.courseId,
    col: elective.carouselId,
    value: elective
  }));

  const electiveTableData = reconstructTableWithDimensions(
    tableCellsData,
    rows,
    cols
  );

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
        {electiveTableData.map((arrayRow, rowIndex) => (
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
