import { useTranslation } from 'react-i18next';
import { DirectoryPlaceholder } from '../directory-placeholder';

export default function StaffPage() {
  const { t } = useTranslation();
  return (
    <DirectoryPlaceholder
      title={t('menu.Staff')}
      description={t('directories.staff.description')}
      apiHint={t('directories.staff.api')}
    />
  );
}
