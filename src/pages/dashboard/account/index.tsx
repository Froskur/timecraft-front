import { useTranslation } from 'react-i18next';
import { DirectoryPlaceholder } from '../directory-placeholder';

export default function AccountPage() {
  const { t } = useTranslation();
  return (
    <DirectoryPlaceholder
      title={t('menu.Account')}
      description={t('directories.account.description')}
      apiHint={t('directories.account.api')}
    />
  );
}
