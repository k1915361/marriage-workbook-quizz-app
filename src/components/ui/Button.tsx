import { Component, JSX, splitProps } from 'solid-js';
import { Toolbar } from '@msviderok/base-ui-solid/toolbar';

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  fullWidth?: boolean;
}

export const Button: Component<ButtonProps> = (props) => {
  const [local, rest] = splitProps(props, ['class', 'variant', 'size', 'fullWidth', 'children', 'type']);
  const variant = local.variant ?? 'primary';
  const size = local.size ?? 'default';

  const className = [
    'base-ui-button',
    `base-ui-button--${variant}`,
    `base-ui-button--${size}`,
    local.fullWidth ? 'base-ui-button--full-width' : '',
    local.class || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Toolbar.Root style={{ display: 'contents' }}>
      <Toolbar.Button type={local.type ?? 'button'} focusableWhenDisabled={false} class={className} {...rest}>
        {local.children}
      </Toolbar.Button>
    </Toolbar.Root>
  );
};
