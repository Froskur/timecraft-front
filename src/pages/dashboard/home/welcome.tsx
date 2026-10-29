import { Text, Title } from '@mantine/core';
import classes from './welcome.module.css';
import { useTranslation } from 'react-i18next';

export function Welcome() {
  const { t } = useTranslation();
  return (
    <>
      <Title className={classes.title} ta="center" mt={100}>
        {t('home.label1')}{' '}
        <Text inherit variant="gradient" component="span" gradient={{ from: 'blue', to: 'cyan' }}>
          {t('home.label2')}
        </Text>
      </Title>
      <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        {t('home.about')}
      </Text>
    </>
  );
}
