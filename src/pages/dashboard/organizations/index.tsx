import { useTranslation } from 'react-i18next';
import { DirectoryPlaceholder } from '../directory-placeholder';

export default function OrganizationsPage() {
  const { t } = useTranslation();
  return (
    <DirectoryPlaceholder
      title={t('menu.Organizations')}
      description={t('directories.organizations.description')}
      apiHint={t('directories.organizations.api')}
    />
  );
}
