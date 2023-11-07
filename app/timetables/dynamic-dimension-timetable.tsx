import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow
} from '@tremor/react';

import { TabularDTO } from '../api/dto-interfaces';
import InteractiveTableCard from '../components/interactive-table-card';
import { reconstructTableWithDimensions } from '../utils/tables';
import React from 'react';

interface HeaderTransformer<H> {
  (arg: H): React.ReactNode;
}

interface CellDataTransformer<D> {
  (arg: D): React.ReactNode;
}

interface Props<H, D> {
  tableContents: TabularDTO<H, D>;
  headerTransformer: HeaderTransformer<H>;
  cellDataTransformer: CellDataTransformer<D>;
}

export default function DynamicDimensionTimetable<H, D>({
  tableContents: {
    cellDataAndMetaData,
    headerData,
    numberOfColumns,
    numberOfRows
  },
  headerTransformer,
  cellDataTransformer
}: Props<H, D>) {
  console.log(cellDataAndMetaData, headerData, numberOfColumns, numberOfRows);

  // if (!(cellDataAndMetaData && headerData && numberOfRows && numberOfColumns))
  //   return (
  //     <div>
  //       <p>No table.</p>
  //     </div>
  //   );

  const mainTable = reconstructTableWithDimensions<D>(
    cellDataAndMetaData,
    numberOfColumns,
    numberOfRows
  );

  console.log(mainTable);

  return (
    <Table className="overflow-visible max-w-fit">
      <TableHead className="">
        <TableRow>
          {headerData.map((singleWeekLabels, index) => (
            <TableHeaderCell
              id={`header-${index}`}
              key={`header-${index}`}
              className=""
            >
              {headerTransformer(singleWeekLabels)}
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {mainTable.map((row, rowIndex) => (
          <TableRow key={`row-${rowIndex}`}>
            {row.map((cellInfo, cellIndex) => (
              <TableCell
                key={`cell-${rowIndex}-${cellIndex}`}
                className="p-0 max-w-fit"
                aria-labelledby={`header-${cellIndex}`}
              >
                <InteractiveTableCard
                  additionalClassNames={['border-transparent']}
                >
                  {cellDataTransformer(cellInfo)}
                </InteractiveTableCard>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
