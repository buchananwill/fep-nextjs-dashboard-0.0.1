import AddTeacherForm from '../../add-teacher-form/add-teacher-form';
import ServiceCategoryProvider from '../../../generic/providers/service-category-provider';
import { SECONDARY_EDUCATION_CATEGORY_ID } from '../../../api/main';

export default function NewTeacherPage() {
  return (
    <>
      <ServiceCategoryProvider
        serviceCategoryId={SECONDARY_EDUCATION_CATEGORY_ID}
      />
      <AddTeacherForm></AddTeacherForm>
    </>
  );
}
