import { Text, Title } from '@mantine/core';
import { Page } from '@/components/page';
import { PageHeader } from '@/components/page-header';

interface DirectoryPlaceholderProps {
  title: string;
  description: string;
  apiHint: string;
}

export function DirectoryPlaceholder({ title, description, apiHint }: DirectoryPlaceholderProps) {
  return (
    <Page title={title}>
      <PageHeader title={title} />
      <Title order={4} mt="md" mb="xs">
        {description}
      </Title>
      <Text c="dimmed" maw={40} style={{ maxWidth: '40rem' }}>
        {apiHint}
      </Text>
    </Page>
  );
}
