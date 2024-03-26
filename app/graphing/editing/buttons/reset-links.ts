import { HasNumberIdDto } from '../../../api/dtos/HasNumberIdDtoSchema';
import { DataLink, DataNode } from '../../../api/zod-mods';
import { SimulationLinkDatum } from 'd3';
import { ClosureDto } from '../../../api/dtos/ClosureDtoSchema';

export function resetLinks<T extends HasNumberIdDto>(
  allUpdatedLinks: DataLink<T>[]
): (SimulationLinkDatum<DataNode<T>> & ClosureDto)[] {
  return [...allUpdatedLinks].map((link, index) => {
    const source = link.source as DataNode<T>;
    const target = link.target as DataNode<T>;
    return { ...link, source: source.id, target: target.id, index };
  });
}