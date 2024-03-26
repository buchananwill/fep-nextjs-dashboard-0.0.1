import { DataNode } from '../../../api/zod-mods';
import { WorkTaskTypeDto } from '../../../api/dtos/WorkTaskTypeDtoSchema';
import { incrementCloneSuffix } from '../../editing/functions/increment-clone-suffix';

function cloneWorkTaskType(
  template: DataNode<WorkTaskTypeDto>
): DataNode<WorkTaskTypeDto> {
  const { data } = template;
  const { name } = data;
  let cloneName = incrementCloneSuffix(name);

  return {
    ...template,
    data: { ...data, name: cloneName }
  };
}

export const CloneFunctionWrapper = { cachedFunction: cloneWorkTaskType };
