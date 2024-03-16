import { getKnowledgeDomains } from '../../api/actions/service-categories';
import { DataNotFoundCard } from '../../timetables/students/[schedule]/page';
import { ServiceCategoryDto } from '../../api/dtos/ServiceCategoryDtoSchema';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { KnowledgeDomainTableCell } from './knowledge-domain-table-cell';

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
            <th className={'flex items-center p-2'}>
              {category.knowledgeDomainDescriptor}
              <button className={'flex btn btn-outline btn-xs ml-2'}>
                <PlusCircleIcon className={'h-4 w-4'}></PlusCircleIcon>New
              </button>
            </th>
            <th>Work Task Types</th>
          </tr>
        </thead>
        <tbody>
          {knowledgeDomains.map((kd, index) => {
            return (
              <tr key={index}>
                <td>
                  <KnowledgeDomainTableCell kd={kd} />
                </td>
                <td>{kd.workTaskTypeCount}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
