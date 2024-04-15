import { getOne } from '../../api/READ-ONLY-generated-actions/ServiceCategory';
import { getDtoListByExampleList as getDomainsByExample } from '../../api/READ-ONLY-generated-actions/KnowledgeDomain';
import { getDtoListByExampleList } from '../../api/READ-ONLY-generated-actions/KnowledgeLevel';
import DtoControllerArray from '../../selective-context/components/controllers/dto-controller-array';
import { isNotUndefined } from '../../api/main';
import { EntityNamesMap } from '../../api/entity-names-map';
import StringMapController from './string-map-controller';

export default async function ServiceCategoryProvider({
  serviceCategoryId
}: {
  serviceCategoryId: number;
}) {
  const { data: serviceCategory } = await getOne(serviceCategoryId);

  const { data: knowledgeDomains } = await getDomainsByExample([
    { serviceCategoryId }
  ]);
  const { data: knowledgeLevels } = await getDtoListByExampleList([
    { serviceCategoryId }
  ]);

  if (
    isNotUndefined(serviceCategory) &&
    isNotUndefined(knowledgeDomains) &&
    isNotUndefined(knowledgeLevels)
  ) {
    return (
      <>
        <DtoControllerArray
          dtoList={[serviceCategory]}
          entityName={EntityNamesMap.serviceCategory}
        />
        <DtoControllerArray
          dtoList={knowledgeDomains}
          entityName={EntityNamesMap.knowledgeDomain}
        />
        <DtoControllerArray
          dtoList={knowledgeLevels}
          entityName={EntityNamesMap.knowledgeLevel}
        />
        <StringMapController entityName={EntityNamesMap.knowledgeDomain} />
        <StringMapController entityName={EntityNamesMap.knowledgeLevel} />
      </>
    );
  }
}
