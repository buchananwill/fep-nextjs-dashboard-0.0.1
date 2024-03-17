import {
  getKnowledgeDomains,
  getKnowledgeLevels
} from '../../../api/actions/service-categories';
import { DataNotFoundCard } from '../../../timetables/students/[schedule]/page';
import { ServiceCategoryDto } from '../../../api/dtos/ServiceCategoryDtoSchema';
import { KnowledgeLevelNameCell } from './knowledge-level-name-cell';
import { NewKnowledgeLevelButton } from './new-knowledge-level-button';
import { KnowledgeLevelDependencies } from './knowledge-level-dependencies';
import { getNameList } from '../knowledge-domain/knowledge-domain-table-editor';

export default async function KnowledgeLevelTableEditor({
  category
}: {
  category: ServiceCategoryDto;
}) {
  const { data: knowledgeLevels } = await getKnowledgeLevels(
    category.id.toString()
  );

  if (knowledgeLevels === undefined) {
    return (
      <DataNotFoundCard>
        Knowledge Level data not found for category: {category.name}
      </DataNotFoundCard>
    );
  }

  const nameList = getNameList(knowledgeLevels);

  return (
    <div className={'h-[60vh]'}>
      <table className={''}>
        <thead className={''}>
          <tr className={'sticky top-0'}>
            <th className={'flex items-center p-2 justify-center'}>
              {category.knowledgeLevelDescriptor}
              <NewKnowledgeLevelButton
                className={'flex btn btn-outline btn-xs ml-2'}
                serviceCategory={category}
                knowledgeLevelNameList={nameList}
              />
            </th>
            <th>Work Task Types</th>
          </tr>
        </thead>
        <tbody>
          {knowledgeLevels.map((kl, index) => {
            return (
              <tr key={index}>
                <td>
                  <KnowledgeLevelNameCell
                    kl={kl}
                    serviceCategory={category}
                    nameList={nameList}
                  />
                </td>
                <td>
                  <KnowledgeLevelDependencies kl={kl} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
