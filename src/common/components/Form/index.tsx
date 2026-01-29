import { type ReactNode, type HTMLAttributes } from 'react';
import { FormProvider, type ControllerRenderProps, type FieldValues, type Path, type UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/common/components/ui/form';

type FormProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  HTMLAttributes<HTMLFormElement>,
  'onSubmit' | 'children'
> & {
  form: UseFormReturn<TFieldValues>;
  onSubmit: Parameters<UseFormReturn<TFieldValues>['handleSubmit']>[0];
  children: {
    formFields: ReactNode;
    footer: ReactNode;
  };
};

export type InputFieldProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
  renderInput: (field: ControllerRenderProps<T, Path<T>>) => React.ReactNode;
}

export const FormItemCustom = <T extends FieldValues>({ form, name, label, renderInput }: InputFieldProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }: { field: ControllerRenderProps<T, Path<T>> }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>{renderInput(field)}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const Form = <TFieldValues extends FieldValues = FieldValues>({
  form,
  children,
  onSubmit,
  ...props
}: FormProps<TFieldValues>) => (
  <FormProvider {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} {...props}>
      <div className="space-y-3">{children.formFields}</div>
      <div className="mt-6">{children.footer}</div>
    </form>
  </FormProvider>
);

export default Form;
