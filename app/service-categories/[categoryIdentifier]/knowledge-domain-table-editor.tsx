import { getKnowledgeDomains } from '../../api/actions/service-categories';
import { DataNotFoundCard } from '../../timetables/students/[schedule]/page';
import { ServiceCategoryDto } from '../../api/dtos/ServiceCategoryDtoSchema';

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
        No knowledge domains found for category: {category.name}
      </DataNotFoundCard>
    );
  }

  return (
    <div className={'h-[60vh]'}>
      <table className={'table table-pin-rows'}>
        <thead className={''}>
          <tr className={''}>
            <th>{category.knowledgeDomainDescriptor}</th>
            <th>Work Task Types</th>
          </tr>
        </thead>
        <tbody>
          {knowledgeDomains.map((kd, index) => {
            return (
              <tr key={index}>
                <td>{kd.name}</td>
                <td>{kd.workTaskTypeCount}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
