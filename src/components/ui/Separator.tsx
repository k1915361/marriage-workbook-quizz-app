import { Component, JSX } from 'solid-js';
import { Separator as BaseSeparator } from '@msviderok/base-ui-solid/separator';

export interface SeparatorProps {
  class?: string;
  role?: JSX.AriaAttributes['role'];
  orientation?: 'horizontal' | 'vertical';
}

export const Separator: Component<SeparatorProps> = (props) => {
  const { class: className = '', orientation = 'horizontal', ...rest } = props;
  return (
    <BaseSeparator
      class={`separator separator--${orientation} ${className}`}
      orientation={orientation}
      {...rest}
    />
  );
};
