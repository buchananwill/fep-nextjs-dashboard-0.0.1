import { HasNumberIdDto } from '../../../api/dtos/HasNumberIdDtoSchema';
import { HasNameDto } from '../../../api/dtos/HasNameDtoSchema';
import { GraphDto, GraphDtoPutRequestBody } from '../../../api/zod-mods';
import { ActionResponsePromise } from '../../../api/actions/actionResponse';
import { deDuplicateNames } from '../../editing/functions/increment-clone-suffix';
import _ from 'lodash';

export function getGraphUpdaterWithNameDeDuplication<
  T extends HasNumberIdDto & HasNameDto
>(
  putUpdatedGraph: (
    request: GraphDtoPutRequestBody<T>
  ) => ActionResponsePromise<GraphDto<T>>
) {
  return (request: GraphDtoPutRequestBody<T>) => {
    const { graphDto } = request;
    const { nodes } = graphDto;
    const organizationDtos = nodes.map((dn) => dn.data);
    const dtosWithNamesDeDuplicated = deDuplicateNames(organizationDtos);
    const nodesWithDataNamesDeDuplicated = nodes.map((dn, index) => {
      const replacementData = dtosWithNamesDeDuplicated[index];
      if (replacementData.id !== dn.id)
        throw Error('Arrays not aligned. Could not clone nodes.');
      const cloneDeep = _.cloneDeep(dn);
      cloneDeep.data = replacementData;
      return cloneDeep;
    });
    const safeGraph: GraphDto<T> = {
      ...graphDto,
      nodes: nodesWithDataNamesDeDuplicated
    };
    const safeRequest = { ...request, graphDto: safeGraph };
    return putUpdatedGraph(safeRequest);
  };
}