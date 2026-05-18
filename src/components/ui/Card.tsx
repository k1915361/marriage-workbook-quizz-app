import { Component, JSX } from 'solid-js';

interface CardProps {
  children: JSX.Element;
  class?: string;
  padding?: 'default' | 'sm' | 'none';
  textCenter?: boolean;
}

export const Card: Component<CardProps> = (props) => {
  const paddingClass = props.padding === 'sm' ? 'card--padding-sm' : props.padding === 'none' ? 'card--padding-none' : 'card--padding-default';
  
  return (
    <div
      class={`card ${paddingClass} ${props.textCenter ? 'card--text-center' : ''} ${props.class || ''}`}
    >
      {props.children}
    </div>
  );
};
