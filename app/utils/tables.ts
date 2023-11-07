import { CellDataAndMetaData } from '../api/dto-interfaces';

export function reconstructTableWithDimensions<D>(
  flatList: CellDataAndMetaData<D>[],
  numCols: number,
  numRows: number
): D[][] {
  // Initialize the 2D array
  const table: D[][] = Array.from({ length: numRows }, () =>
    Array(numCols).fill(null)
  );

  // Populate the table based on the row and col indices from the flatList
  for (const cell of flatList) {
    // const cellCol = cell.cellColumn - firstColumn;
    if (cell.cellRow < numRows && cell.cellColumn < numCols) {
      table[cell.cellRow][cell.cellColumn] = cell.cellData;
    } else {
      console.error(
        'Invalid cell index. Col:',
        cell.cellColumn,
        'exceeds: ',
        numCols,
        ' or Row: ',
        cell.cellRow,
        ' exceeds ',
        numRows
      );
    }
  }

  return table;
}
