export function transformRecordToObjectArray(
  inputMap: Record<string, number>
): Array<{ keyName: string; valueName: number }> {
  return Object.entries(inputMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, value]) => ({
      keyName: key,
      valueName: value
    }));
}
