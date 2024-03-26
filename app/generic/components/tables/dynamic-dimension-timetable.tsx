import { TabularDTO } from '../../../api/dto-interfaces';
import { reconstructTableWithDimensions } from '../../../utils/tables';
import { FC } from 'react';

export type HeaderTransformer<H> = FC<HeaderTransformerProps<H>>;

export type CellDataTransformer<D> = FC<CellDataTransformerProps<D>>;

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
}

export default function DynamicDimensionTimetable<H, D>({
  tableContents: {
    cellDataAndMetaData,
    headerData,
    numberOfColumns,
    numberOfRows
  },
  headerTransformer: HeaderTransformerComponent,
  cellDataTransformer: CellTransformerComponent
}: Props<H, D>) {
  const mainTable = reconstructTableWithDimensions<D>(
    cellDataAndMetaData,
    numberOfColumns,
    numberOfRows
  );

  return (
    <div className="dynamic-dimension-table">
      <table className="m-2 p-0 overflow-visible max-h-min">
        <thead className="">
          <tr>
            {headerData.map((headerData, index) => (
              <th
                id={`header-${index}`}
                key={`header-${index}`}
                className="text-center"
              >
                <HeaderTransformerComponent data={headerData} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y-0">
          {mainTable.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`}>
              {row.map((data, cellIndex) => (
                <td
                  key={`cell-${rowIndex}-${cellIndex}`}
                  className="p-0 max-w-fit"
                  aria-labelledby={`header-${cellIndex}`}
                >
                  <CellTransformerComponent data={data} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
