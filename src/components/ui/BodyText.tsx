import { Component, JSX } from 'solid-js';

interface BodyTextProps {
  children: JSX.Element;
  class?: string;
  variant?: 'lead' | 'body';
}

export const BodyText: Component<BodyTextProps> = (props) => {
  const variantClass = props.variant === 'lead' ? 'body-text--lead' : 'body-text--body';
  return <p class={`body-text ${variantClass} ${props.class || ''}`}>{props.children}</p>;
};
