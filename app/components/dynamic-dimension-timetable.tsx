import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow
} from '@tremor/react';

import { TabularDTO } from '../api/dto-interfaces';
import { reconstructTableWithDimensions } from '../utils/tables';
import React from 'react';

export type HeaderTransformer<H> = React.FC<HeaderTransformerProps<H>>;

export type CellDataTransformer<D> = React.FC<CellDataTransformerProps<D>>;

interface CellDataTransformerProps<D> {
  data: D;
}

interface HeaderTransformerProps<H> {
  data: H;
}

interface Props<H, D> {
  tableContents: TabularDTO<H, D>;
  headerTransformer: HeaderTransformer<H>;
  cellDataTransformer: CellDataTransformer<D>;
  className?: string;
}

export default function DynamicDimensionTimetable<H, D>({
  tableContents: {
    cellDataAndMetaData,
    headerData,
    numberOfColumns,
    numberOfRows
  },
  headerTransformer: HeaderTransformerComponent,
  cellDataTransformer: CellTransformerComponent,
  className
}: Props<H, D>) {
  const mainTable = reconstructTableWithDimensions<D>(
    cellDataAndMetaData,
    numberOfColumns,
    numberOfRows
  );

  return (
    <Table className="flex-shrink-0 flex-grow-0 m-2 p-0 overflow-visible max-h-min">
      <TableHead className="">
        <TableRow>
          {headerData.map((headerData, index) => (
            <TableHeaderCell
              id={`header-${index}`}
              key={`header-${index}`}
              className="text-center"
            >
              <HeaderTransformerComponent data={headerData} />
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody className="divide-y-0">
        {mainTable.map((row, rowIndex) => (
          <TableRow key={`row-${rowIndex}`}>
            {row.map((data, cellIndex) => (
              <TableCell
                key={`cell-${rowIndex}-${cellIndex}`}
                className="p-0 max-w-fit"
                aria-labelledby={`header-${cellIndex}`}
              >
                <CellTransformerComponent data={data} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
