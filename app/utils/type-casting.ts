export function getNumberParam(param: string | null): number | null {
    if (param === null) {
        console.log("Param is null")
      return null
    }
    const num = parseInt(param, 10);
    if (isNaN(num)) {
        console.log("Param is NaN")
      return null
    }
    return num;
  }