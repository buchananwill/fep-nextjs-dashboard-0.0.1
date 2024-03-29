import { HasNumberIdDto } from '../../../api/dtos/HasNumberIdDtoSchema';
import {
  GenericFunctionWrapper,
  useSelectiveContextControllerFunction
} from '../../../selective-context/components/typed/selective-context-manager-function';
import { DataNode } from '../../../api/zod-mods';
import { useContext } from 'react';
import { GraphContext } from '../../graph/graph-context-creator';
import { NodeCloneFunctionKey } from '../../nodes/node-editor-disclosure';

export function useNodeCloneFunction<T extends HasNumberIdDto>(
  initialValue: GenericFunctionWrapper<DataNode<T>, DataNode<T>>
) {
  const { uniqueGraphName } = useContext(GraphContext);
  useSelectiveContextControllerFunction<DataNode<T>, DataNode<T>>(
    NodeCloneFunctionKey,
    uniqueGraphName,
    initialValue
  );
}
