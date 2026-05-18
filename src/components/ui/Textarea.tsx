import { Component, JSX } from 'solid-js';
import { Field } from '@msviderok/base-ui-solid/field';

interface TextareaProps {
  id?: string;
  class?: string;
  placeholder?: string;
  value: string;
  rows?: number;
  onInput: JSX.EventHandlerUnion<HTMLTextAreaElement, InputEvent>;
}

export const Textarea: Component<TextareaProps> = (props) => {
  return (
    <Field.Root class={`textarea-field ${props.class || ''}`}>
      <Field.Control
        render={(controlProps) => (
          <textarea
            {...controlProps}
            id={props.id}
            placeholder={props.placeholder}
            rows={props.rows ?? 5}
          />
        )}
        class="textarea"
        value={props.value}
        onInput={props.onInput as unknown as JSX.EventHandlerUnion<HTMLInputElement, InputEvent>}
      />
    </Field.Root>
  );
};
