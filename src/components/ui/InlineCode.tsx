import { Component, JSX } from 'solid-js';

interface InlineCodeProps {
  children: JSX.Element;
  class?: string;
}

export const InlineCode: Component<InlineCodeProps> = (props) => {
  return (
    <code class={`inline-code ${props.class || ''}`}>
      {props.children}
    </code>
  );
};
