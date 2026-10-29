import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Anchor, Button, Divider, Group, Stack, StackProps } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { LoginFormSchema } from '@/api/dtos';
import { Checkbox } from '@/components/forms/checkbox';
import { FormProvider } from '@/components/forms/form-provider';
import { PasswordInput } from '@/components/forms/password-input';
import { TextInput } from '@/components/forms/text-input';
import { useAuth, useLogin } from '@/hooks';
import { paths } from '@/routes';
import { handleFormErrors } from '@/utilities/form';

interface LoginFormProps extends Omit<StackProps, 'children'> {
  onSuccess?: () => void;
}

const DEMO_EMAIL = 'demo@timecraft.local';
const DEMO_PASSWORD = 'demo-password';

export function LoginForm({ onSuccess, ...props }: LoginFormProps) {
  const { setIsAuthenticated, enterPreview } = useAuth();
  const { mutate: login, isPending } = useLogin();
  const { t } = useTranslation();

  const form = useForm({
    mode: 'uncontrolled',
    validate: zodResolver(LoginFormSchema),
    initialValues: { email: DEMO_EMAIL, password: DEMO_PASSWORD, remember: true },
  });

  const handleSubmit = form.onSubmit((values) => {
    login(
      { variables: { email: values.email, password: values.password } },
      {
        onSuccess: () => {
          sessionStorage.removeItem('timecraft_shell_preview');
          setIsAuthenticated(true);
          onSuccess?.();
        },
        onError: (error) => handleFormErrors(form, error),
      }
    );
  });

  return (
    <FormProvider form={form} onSubmit={handleSubmit}>
      <Stack {...props}>
        <TextInput name="email" label={t('login.email')} required />
        <PasswordInput name="password" label={t('login.password')} required />
        <Group justify="space-between">
          <Checkbox name="remember" label={t('login.remember')} />
          <Anchor size="sm" component={NavLink} to={paths.auth.forgotPassword}>
            {t('login.forgot')}
          </Anchor>
        </Group>
        <Button type="submit" loading={isPending}>
          {t('login.login')}
        </Button>
        <Divider label="ИЛИ" labelPosition="center" />
        <Button type="button" variant="light" onClick={enterPreview}>
          {t('login.preview')}
        </Button>
      </Stack>
    </FormProvider>
  );
}
