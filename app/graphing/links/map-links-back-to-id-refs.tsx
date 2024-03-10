import { HasNumberIdDto } from '../../api/dtos/HasNumberIdDtoSchema';
import { DataLink, DataNode } from '../../api/zod-mods';

export function mapLinksBackToIdRefs<T extends HasNumberIdDto>(l: DataLink<T>) {
  const objectRefSource = l.source as DataNode<T>;
  const objectRefTarget = l.target as DataNode<T>;
  return { ...l, source: objectRefSource.id, target: objectRefTarget.id };
}