import { getKnowledgeDomains } from '../../../api/actions/service-categories';
import { DataNotFoundCard } from '../../../timetables/students/[schedule]/page';
import { ServiceCategoryDto } from '../../../api/dtos/ServiceCategoryDtoSchema';
import { KnowledgeDomainNameCell } from './knowledge-domain-name-cell';
import { NewKnowledgeDomainButton } from './new-knowledge-domain-button';
import { KnowledgeDomainDependencies } from './knowledge-domain-dependencies';
import { HasNameDto } from '../../../api/dtos/HasNameDtoSchema';

export function getNameList<T extends HasNameDto>(namedDtoArray: T[]) {
  return namedDtoArray.map((dto) => dto.name);
}

export default async function KnowledgeDomainTableEditor({
  category
}: {
  category: ServiceCategoryDto;
}) {
  const { data: knowledgeDomains } = await getKnowledgeDomains(
    category.id.toString()
  );

  if (knowledgeDomains === undefined) {
    return (
      <DataNotFoundCard>
        Knowledge domain data not found for category: {category.name}
      </DataNotFoundCard>
    );
  }
  const nameList = getNameList(knowledgeDomains);

  return (
    <div className={'h-[60vh]'}>
      <table className={''}>
        <thead className={'sticky top-0 bg-white opacity-100 z-10'}>
          <tr>
            <th scope={'col'}>
              <div className={'flex items-center p-2 justify-center'}>
                {category.knowledgeDomainDescriptor}
                <NewKnowledgeDomainButton
                  className={
                    'flex btn btn-outline btn-xs ml-2 relative overflow-hidden'
                  }
                  serviceCategory={category}
                  knowledgeDomainServiceCategoryNameList={nameList}
                />
              </div>
            </th>
            <th scope={'col'}>
              <div className={'flex items-center p-2 justify-center'}>
                Work Task Types
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {knowledgeDomains.map((kd, index) => {
            return (
              <tr key={kd.id}>
                <td>
                  <KnowledgeDomainNameCell kd={kd} nameList={nameList} />
                </td>
                <td>
                  <KnowledgeDomainDependencies kd={kd} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
