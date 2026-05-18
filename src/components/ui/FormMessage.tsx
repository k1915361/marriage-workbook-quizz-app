import { Component, JSX } from 'solid-js';

interface FormMessageProps {
  children: JSX.Element;
  variant: 'error' | 'success';
  class?: string;
}

export const FormMessage: Component<FormMessageProps> = (props) => {
  const variantClass = props.variant === 'error' ? 'form-message--error' : 'form-message--success';
  return (
    <p class={`form-message ${variantClass} ${props.class || ''}`}>
      {props.children}
    </p>
  );
};
