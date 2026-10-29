import { Outlet } from 'react-router-dom';
import { Box, Center, Flex, Image, SimpleGrid, Text, Title } from '@mantine/core';
import demoImg from '@/assets/app-demo.webp';
import { Logo } from '@/components/logo';
import { useTranslation } from 'react-i18next';
import { LangToggler } from '@/components/lang-toggler';

export function AuthLayout() {
  const { t } = useTranslation();

  return (
    <SimpleGrid mih="100vh" p="md" cols={{ base: 1, lg: 2 }}>
      <Flex direction="column" align="flex-start">
        <LangToggler />
        <Center flex={1} w="100%">
          <Box maw="25rem">
            <Logo size="3rem" display="block" c="var(--mantine-primary-color-filled)" mb="xl" />
            <Outlet />
          </Box>
        </Center>
      </Flex>

      <Center
        ta="center"
        p="4rem"
        bg="var(--mantine-color-default-hover)"
        display={{ base: 'none', lg: 'flex' }}
        style={{ borderRadius: 'var(--mantine-radius-md)' }}
      >
        <Box maw="40rem">
          <Title order={2}>{t('auth.label')}</Title>
          <Text my="lg" c="dimmed">
            {t('auth.slogan')}
          </Text>

          <Image src={demoImg} alt="TimeCraft" />
        </Box>
      </Center>
    </SimpleGrid>
  );
}
