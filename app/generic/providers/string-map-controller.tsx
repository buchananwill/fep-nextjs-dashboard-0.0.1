'use client';
import { useStringMapContextController } from '../../graphing/graph-types/work-task-types/use-string-map-context-controller';

export default function StringMapController({
  entityName
}: {
  entityName: string;
}) {
  useStringMapContextController(
    entityName,
    `${entityName}:stringMapController`
  );
  return null;
}
