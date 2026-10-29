import { useTranslation } from 'react-i18next';
import { DirectoryPlaceholder } from '../directory-placeholder';

export default function ResourcesPage() {
  const { t } = useTranslation();
  return (
    <DirectoryPlaceholder
      title={t('menu.Resources')}
      description={t('directories.resources.description')}
      apiHint={t('directories.resources.api')}
    />
  );
}
