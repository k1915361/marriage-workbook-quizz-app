import { Component, JSX, splitProps } from 'solid-js';

export interface LinkProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
  external?: boolean;
}

export const Link: Component<LinkProps> = (props) => {
  const [local, rest] = splitProps(props, ['class', 'external', 'children']);
  
  return (
    <a
      class={`link ${local.class || ''}`}
      target={local.external ? '_blank' : undefined}
      rel={local.external ? 'noopener noreferrer' : undefined}
      {...rest}
    >
      {local.children}
    </a>
  );
};
