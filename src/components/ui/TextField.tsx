import { Component, JSX, splitProps } from 'solid-js';
import { Field } from '@msviderok/base-ui-solid/field';
import { Input } from '@msviderok/base-ui-solid/input';

export interface TextFieldProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
}

export const TextField: Component<TextFieldProps> = (props) => {
  const [local, rest] = splitProps(props, ['class', 'label', 'description', 'error', 'children']);
  
  return (
    <Field.Root class={`text-field ${local.class || ''}`} invalid={Boolean(local.error)}>
      {local.label && <Field.Label class="text-field__label">{local.label}</Field.Label>}
      <Input class="text-field__input" {...rest} />
      {local.description && (
        <Field.Description class="text-field__description">{local.description}</Field.Description>
      )}
      {local.error && <Field.Error class="text-field__error">{local.error}</Field.Error>}
    </Field.Root>
  );
};
