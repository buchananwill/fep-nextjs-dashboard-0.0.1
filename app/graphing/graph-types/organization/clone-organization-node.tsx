import { CloneFunction } from '../../editing/buttons/add-nodes-button';
import { DataNode } from '../../../api/zod-mods';
import { OrganizationDto } from '../../../api/dtos/OrganizationDtoSchema';
import { incrementCloneSuffix } from '../../editing/functions/increment-clone-suffix';

export const NameCharLimit = 255;
export function cloneOrganizationNode(
  templateNode: DataNode<OrganizationDto>
): DataNode<OrganizationDto> {
  // if (templateNode === undefined) return undefined

  const {
    data: { name }
  } = templateNode;
  let cloneName = incrementCloneSuffix(name);

  return {
    ...templateNode,
    data: { ...templateNode.data, name: cloneName }
  };
}
