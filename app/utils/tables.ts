import { CellDataAndMetaData } from '../api/dto-interfaces';

export function reconstructTableWithDimensions<D>(
  flatList: CellDataAndMetaData<D>[],
  numCols: number,
  numRows: number
): D[][] {
  console.log('numCols: ', numCols);
  console.log('numRows: ', numRows);

  // TODO FIX THE 2+ TABLE SCENARIO
  if (numCols == 12) {
    numCols = 6;
  }

  console.log('Flatlist: ', flatList);

  // Initialize the 2D array
  const table: D[][] = Array.from({ length: numRows }, () =>
    Array(numCols).fill(null)
  );

  // Check starting index:
  let columnStartingIndex = NaN;
  let rowStartingIndex = NaN;
  for (let { cellRow, cellColumn } of flatList) {
    columnStartingIndex =
      isNaN(columnStartingIndex) || cellColumn < columnStartingIndex
        ? cellColumn
        : columnStartingIndex;
    rowStartingIndex =
      isNaN(rowStartingIndex) || cellRow < rowStartingIndex
        ? cellRow
        : rowStartingIndex;
  }

  // Populate the table based on the row and col indices from the flatList
  for (const { cellColumn, cellData, cellRow } of flatList) {
    const actualRow = cellRow - rowStartingIndex;
    const actualColumn = cellColumn - columnStartingIndex;
    if (actualRow < numRows && actualColumn < numCols) {
      table[actualRow][actualColumn] = cellData;
    } else {
      console.error(
        'Invalid cell index. Col:',
        actualColumn,
        'exceeds: ',
        numCols,
        ' or Row: ',
        actualRow,
        ' exceeds ',
        numRows
      );
    }
  }

  return table;
}
