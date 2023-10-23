export interface TableCellData {
    row: number;
    col: number;
    value: any;
  }
  
  export const reconstructTableWithDimensions = (flatList: TableCellData[], numRows: number, numCols: number): any[][] => {
    // Initialize the 2D array
    const table: any[][] = Array.from({ length: numRows }, () => Array(numCols).fill(null));

    console.log(table)

    console.log("rows: ", numRows, "cols: ", numCols)
  
    // Populate the table based on the row and col indices from the flatList
    for (const cell of flatList) {
      if (cell.row < numRows && cell.col < numCols) {
        table[cell.row][cell.col] = cell.value;
      } else {
        console.log(cell.col, cell.row)
        console.error('Invalid cell index', cell);
      }
    }
  
    return table;
  };
  
  
  