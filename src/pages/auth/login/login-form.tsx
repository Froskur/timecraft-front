import { NavLink } from 'react-router-dom';
import { Anchor, Button, Divider, Group, Stack, StackProps } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { LoginRequestSchema } from '@/api/dtos';
import { Checkbox } from '@/components/forms/checkbox';
import { FormProvider } from '@/components/forms/form-provider';
import { PasswordInput } from '@/components/forms/password-input';
import { TextInput } from '@/components/forms/text-input';
import { useAuth, useLogin } from '@/hooks';
import { paths } from '@/routes';
import { handleFormErrors } from '@/utilities/form';
import { useTranslation } from 'react-i18next';

interface LoginFormProps extends Omit<StackProps, 'children'> {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess, ...props }: LoginFormProps) {
  const { setIsAuthenticated, enterPreview } = useAuth();
  const { mutate: login, isPending } = useLogin();
  const { t } = useTranslation();

  const form = useForm({
    mode: 'uncontrolled',
    validate: zodResolver(LoginRequestSchema),
    initialValues: { email: '', password: '', remember: false },
  });

  const handleSubmit = form.onSubmit((variables) => {
    login(
      { variables },
      {
        onSuccess: () => {
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
        <Divider label="OR" labelPosition="center" />
        <Button type="button" variant="light" onClick={enterPreview}>
          {t('login.preview')}
        </Button>
      </Stack>
    </FormProvider>
  );
}
