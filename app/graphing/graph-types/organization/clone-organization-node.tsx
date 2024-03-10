import { CloneFunction } from '../../editing/add-nodes-button';
import { DataNode } from '../../../api/zod-mods';
import { OrganizationDto } from '../../../api/dtos/OrganizationDtoSchema';

const nameCharLimit = 255;
export const cloneOrganizationNode: CloneFunction<DataNode<OrganizationDto>> = (
  templateNode
) => {
  const {
    data: { name }
  } = templateNode;
  let cloneName = `${name}${templateNode.data.name.substring(name.length - 1)}`;
  cloneName.length > nameCharLimit
    ? cloneName.substring(cloneName.length - nameCharLimit)
    : cloneName;
  return {
    ...templateNode,
    data: { ...templateNode.data, name: cloneName }
  };
};