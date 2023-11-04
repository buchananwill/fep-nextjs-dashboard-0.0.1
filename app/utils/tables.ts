export interface TableCellData {
  row: number;
  col: number;
  value: any;
}

export const reconstructTableWithDimensions = (
  flatList: TableCellData[],
  numRows: number,
  numCols: number
): any[][] => {
  const firstColumn = flatList.reduce(
    (min, cellData) => (cellData.col < min ? cellData.col : min),
    flatList[0].col
  );

  // Initialize the 2D array
  const table: any[][] = Array.from({ length: numRows }, () =>
    Array(numCols).fill(null)
  );

  // Populate the table based on the row and col indices from the flatList
  for (const cell of flatList) {
    const cellCol = cell.col - firstColumn;
    if (cell.row < numRows && cellCol !== null) {
      table[cell.row][cellCol] = cell.value;
    } else {
      console.error(
        'Invalid cell index. Col:',
        cellCol,
        'exceeds: ',
        numCols,
        ' and Row: ',
        cell.row,
        ' exceeds ',
        numRows
      );
    }
  }

  return table;
};
