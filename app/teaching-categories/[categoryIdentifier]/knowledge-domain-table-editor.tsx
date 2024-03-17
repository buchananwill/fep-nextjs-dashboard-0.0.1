import { getKnowledgeDomains } from '../../api/actions/service-categories';
import { DataNotFoundCard } from '../../timetables/students/[schedule]/page';
import { ServiceCategoryDto } from '../../api/dtos/ServiceCategoryDtoSchema';
import { KnowledgeDomainNameCell } from './knowledge-domain-name-cell';
import { NewKnowledgeDomainButton } from './new-knowledge-domain-button';
import { KnowledgeDomainDependencies } from './knowledge-domain-dependencies';

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

  return (
    <div className={'h-[60vh]'}>
      <table className={''}>
        <thead className={''}>
          <tr className={''}>
            <th className={'flex items-center p-2 justify-center'}>
              {category.knowledgeDomainDescriptor}
              <NewKnowledgeDomainButton
                className={'flex btn btn-outline btn-xs ml-2'}
                serviceCategory={category}
              />
            </th>
            <th>Work Task Types</th>
          </tr>
        </thead>
        <tbody>
          {knowledgeDomains.map((kd, index) => {
            return (
              <tr key={index}>
                <td>
                  <KnowledgeDomainNameCell kd={kd} />
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
