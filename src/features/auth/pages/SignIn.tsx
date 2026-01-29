import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useSignIn } from '@/common/auth';
import { useShowErrorMessage } from '@/common/hooks';
import { Typography, Form } from '@/common/components';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';

import FormWrapper from '../components/FormWrapper';
import { useSignInValidation, type SignInFields } from '../validations';
import { AUTH_ROUTES } from '../routes';
import { FormItemCustom } from '@/common/components/Form';

const SignIn = () => {
  const { t } = useTranslation('auth');

  const { signIn, isPending } = useSignIn();

  const onError = useShowErrorMessage();

  const form = useForm<SignInFields>({
    resolver: zodResolver(useSignInValidation()),
    defaultValues: {
      email: '',
      password: '',
    } satisfies SignInFields,
  });

  const onSubmit = useCallback(
    (values: SignInFields) => signIn(values, { onError }),
    [signIn, onError],
  );

  return (
    <FormWrapper title={t('signIn.title')}>
      <Form form={form} onSubmit={onSubmit} id="auth-form">
        {{
          formFields: (
            <>
              <FormItemCustom
                form={form}
                name="email"
                label={t('signIn.email')}
                renderInput={(field) => (
                  <Input type="email" {...field} />
                )}
              />
              <FormItemCustom
                form={form}
                name="password"
                label={t('signIn.password')}
                renderInput={(field) => (
                  <Input type="password" {...field} />
                )}
              />
            </>
          ),
          footer: (
            <>
              <Button form="auth-form" type="submit" disabled={isPending} loading={isPending} block>
                {t('signIn.submit')}
              </Button>
              <Typography variant="regularText" className="mt-4">
                <Link to={AUTH_ROUTES.resetPassword.to}>{t('signIn.resetPassword')}</Link>
              </Typography>
            </>
          ),
        }}
      </Form>
    </FormWrapper>
  );
};

export default SignIn;
