import { Component, JSX } from 'solid-js';

interface EyebrowProps {
  children: JSX.Element;
  class?: string;
}

export const Eyebrow: Component<EyebrowProps> = (props) => {
  return (
    <p class={`eyebrow ${props.class || ''}`}>
      {props.children}
    </p>
  );
};
