import { useTranslation } from 'react-i18next';
import { DirectoryPlaceholder } from '../directory-placeholder';

export default function LocationsPage() {
  const { t } = useTranslation();
  return (
    <DirectoryPlaceholder
      title={t('menu.Locations')}
      description={t('directories.locations.description')}
      apiHint={t('directories.locations.api')}
    />
  );
}
