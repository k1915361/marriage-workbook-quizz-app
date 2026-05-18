import { Component, JSX } from 'solid-js';

interface SectionLabelProps {
  children: JSX.Element;
  class?: string;
}

export const SectionLabel: Component<SectionLabelProps> = (props) => {
  return (
    <p class={`section-label ${props.class || ''}`}>
      {props.children}
    </p>
  );
};
