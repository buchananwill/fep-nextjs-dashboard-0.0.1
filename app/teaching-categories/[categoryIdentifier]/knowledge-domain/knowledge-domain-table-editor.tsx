import { getKnowledgeDomains } from '../../../api/actions/service-categories';
import { DataNotFoundCard } from '../../../timetables/students/[schedule]/page';
import { ServiceCategoryDto } from '../../../api/dtos/ServiceCategoryDtoSchema';
import { KnowledgeDomainNameCell } from './knowledge-domain-name-cell';
import { NewKnowledgeDomainButton } from './new-knowledge-domain-button';
import { KnowledgeDomainDependencies } from './knowledge-domain-dependencies';
import { HasNameDto } from '../../../api/dtos/HasNameDtoSchema';
import {
  KnowledgeCategoryTable,
  KnowledgeCategoryTableBody,
  KnowledgeCategoryTableCell,
  KnowledgeCategoryTableHeader,
  KnowledgeCategoryTableHeaderCell,
  KnowledgeCategoryTableRow
} from '../components/knowledge-category-table';

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
    <KnowledgeCategoryTable>
      <KnowledgeCategoryTableHeader>
        <KnowledgeCategoryTableHeaderCell>
          {category.knowledgeDomainDescriptor}
          <NewKnowledgeDomainButton
            className={
              'flex btn btn-outline btn-xs ml-2 relative overflow-hidden'
            }
            serviceCategory={category}
            knowledgeDomainServiceCategoryNameList={nameList}
          />
        </KnowledgeCategoryTableHeaderCell>
        <KnowledgeCategoryTableHeaderCell>
          Work Task Types
        </KnowledgeCategoryTableHeaderCell>
      </KnowledgeCategoryTableHeader>
      <KnowledgeCategoryTableBody>
        {knowledgeDomains.map((kd) => {
          return (
            <KnowledgeCategoryTableRow key={kd.id}>
              <KnowledgeCategoryTableCell>
                <KnowledgeDomainNameCell kd={kd} nameList={nameList} />
              </KnowledgeCategoryTableCell>
              <KnowledgeCategoryTableCell>
                <KnowledgeDomainDependencies kd={kd} />
              </KnowledgeCategoryTableCell>
            </KnowledgeCategoryTableRow>
          );
        })}
      </KnowledgeCategoryTableBody>
    </KnowledgeCategoryTable>
  );
}
