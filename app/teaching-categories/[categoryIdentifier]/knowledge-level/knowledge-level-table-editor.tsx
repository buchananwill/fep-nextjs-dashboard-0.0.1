import { getKnowledgeLevels } from '../../../api/actions/service-categories';
import { DataNotFoundCard } from '../../../timetables/students/[schedule]/page';
import { ServiceCategoryDto } from '../../../api/dtos/ServiceCategoryDtoSchema';
import { KnowledgeLevelNameCell } from './knowledge-level-name-cell';
import { NewKnowledgeLevelButton } from './new-knowledge-level-button';
import { KnowledgeLevelDependencies } from './knowledge-level-dependencies';
import { getNameList } from '../knowledge-domain/knowledge-domain-table-editor';
import {
  KnowledgeCategoryTable,
  KnowledgeCategoryTableBody,
  KnowledgeCategoryTableCell,
  KnowledgeCategoryTableHeader,
  KnowledgeCategoryTableHeaderCell,
  KnowledgeCategoryTableRow
} from '../components/knowledge-category-table';

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
    <KnowledgeCategoryTable>
      <KnowledgeCategoryTableHeader>
        <KnowledgeCategoryTableHeaderCell>
          {category.knowledgeLevelDescriptor}
          <NewKnowledgeLevelButton
            className={'flex btn btn-outline btn-xs ml-2'}
            serviceCategory={category}
            knowledgeLevelNameList={nameList}
          />
        </KnowledgeCategoryTableHeaderCell>
        <KnowledgeCategoryTableHeaderCell>
          Work Task Types
        </KnowledgeCategoryTableHeaderCell>
      </KnowledgeCategoryTableHeader>
      <KnowledgeCategoryTableBody>
        {knowledgeLevels.map((kl, index) => {
          return (
            <KnowledgeCategoryTableRow key={index}>
              <KnowledgeCategoryTableCell>
                <KnowledgeLevelNameCell
                  kl={kl}
                  serviceCategory={category}
                  nameList={nameList}
                />
              </KnowledgeCategoryTableCell>
              <KnowledgeCategoryTableCell>
                <KnowledgeLevelDependencies kl={kl} />
              </KnowledgeCategoryTableCell>
            </KnowledgeCategoryTableRow>
          );
        })}
      </KnowledgeCategoryTableBody>
    </KnowledgeCategoryTable>
  );
}
