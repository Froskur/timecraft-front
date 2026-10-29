import { PiGoogleLogoDuotone as GoogleIcon, PiXLogoDuotone as XIcon } from 'react-icons/pi';
import { NavLink } from 'react-router-dom';
import { Anchor, Button, Divider, Group, Stack, Text, Title } from '@mantine/core';
import { Page } from '@/components/page';
import { UnderlineShape } from '@/components/underline-shape';
import { paths } from '@/routes';
import { LoginForm } from './login-form';
import { useTranslation } from "react-i18next";

export default function LoginPage() {

  const { t } = useTranslation();

  return (
    <Page title="Login">
      <Stack gap="xl">
        <Stack>
          <Title order={2}>
            {t('login.welcome.part1')}{' '}
            <Text fz="inherit" fw="inherit" component="span" pos="relative">
              {t('login.welcome.part2')}
              <UnderlineShape
                c="blue"
                left="0"
                pos="absolute"
                h="0.625rem"
                bottom="-1rem"
                w="7rem"
              />
            </Text>{' '}
            {t('login.welcome.part3')}
          </Title>
          <Text fz="sm" c="dimmed">
            {t('login.description')}
          </Text>
        </Stack>

{/*
        <Group grow>
          <Button leftSection={<XIcon size="1rem" />} variant="outline" color="gray">
            Login with X
          </Button>
          <Button leftSection={<GoogleIcon size="1rem" />} variant="outline" color="gray">
            Login with Google
          </Button>
        </Group>

        <Divider label="OR" labelPosition="center" />
*/}

        <LoginForm />

        <Text fz="sm" c="dimmed">
          {t('login.noaccaunt')}{' '}
          <Anchor fz="inherit" component={NavLink} to={paths.auth.register}>
            {t('login.register')}
          </Anchor>
        </Text>
      </Stack>
    </Page>
  );
}
