import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateUser, useFetchUserEmailAvailability } from '@/api';
import { useShowErrorMessage } from '@/common/hooks';
import { Form } from '@/common/components';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import FormWrapper from '../components/FormWrapper';
import Success from '../components/Success';
import { useSignUpValidation, type SignUpFields } from '../validations';
import { FormItemCustom } from '@/common/components/Form';

const DEBOUNCE_MS = 500;

const SignUp = () => {
  const { t } = useTranslation('auth');

  const [success, setSuccess] = useState(false);

  const onError = useShowErrorMessage();

  const { mutate, isPending } = useCreateUser();

  const form = useForm<SignUpFields>({
    resolver: zodResolver(useSignUpValidation()),
    defaultValues: {
      email: '',
      password: '',
    } satisfies SignUpFields,
  });

  const onSubmit = useCallback(
    (values: SignUpFields) =>
      mutate(values, {
        onSuccess: () => {
          form.reset();
          setSuccess(true);
        },
        onError,
      }),
    [mutate, onError, setSuccess, form],
  );

  const [emailValue] = useDebounce(form.watch('email'), DEBOUNCE_MS);

  const { data: isUserEmailAvailable } = useFetchUserEmailAvailability(emailValue);

  if (success) {
    return <Success title={t('signUp.success.title')} description={t('signUp.success.subTitle')} />;
  }

  return (
    <FormWrapper title={t('signUp.title')}>
      <Form form={form} onSubmit={onSubmit} id="auth-form">
        {{
          formFields: (
            <>
              <FormItemCustom
                form={form}
                name="email"
                label={t('signUp.email')}
                renderInput={(field) => (
                  <>
                    <Input type="email" {...field} />
                    {/* Hiển thị lỗi email đã tồn tại nếu isUserEmailAvailable là false */}
                    {!isUserEmailAvailable && emailValue && (
                      <p className="text-sm font-medium text-destructive mt-2">
                        {t('signUp.emailTaken')}
                      </p>
                    )}
                  </>
                )}
              />
              <FormItemCustom
                form={form}
                name="password"
                label={t('signUp.password')}
                renderInput={(field) => (
                  <Input type="password" {...field} />
                )}
              />
            </>
          ),
          footer: (
            <Button form="auth-form" type="submit" disabled={isPending} loading={isPending} block>
              {t('signUp.submit')}
            </Button>
          ),
        }}
      </Form>
    </FormWrapper>
  );
};

export default SignUp;
