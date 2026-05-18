import { Component, JSX } from 'solid-js';
import { Dynamic } from 'solid-js/web';

interface PageTitleProps {
  children: JSX.Element;
  class?: string;
  as?: 'h1' | 'h2' | 'h3';
  size?: 'default' | 'question';
}

export const PageTitle: Component<PageTitleProps> = (props) => {
  const sizeClass = props.size === 'question' ? 'page-title--question' : 'page-title--default';
  return (
    <Dynamic
      component={props.as ?? 'h1'}
      class={`page-title ${sizeClass} ${props.class || ''}`}
    >
      {props.children}
    </Dynamic>
  );
};
