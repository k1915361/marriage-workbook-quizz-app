import { Component, JSX } from 'solid-js';
import { Link } from './Link';

interface LinkButtonProps {
  href: string;
  children: JSX.Element;
  class?: string;
}

export const LinkButton: Component<LinkButtonProps> = (props) => {
  return (
    <Link
      href={props.href}
      class={`link-button ${props.class || ''}`}
    >
      {props.children}
    </Link>
  );
};
