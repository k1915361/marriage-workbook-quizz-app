import { Component, JSX, splitProps } from 'solid-js';
import { Toolbar } from '@msviderok/base-ui-solid/toolbar';

export interface OptionCardProps {
  class?: string;
  children: JSX.Element;
  selected?: boolean;
  layout?: 'row' | 'radio' | 'compact';
  disabled?: boolean;
  onClick?: (e: MouseEvent) => void;
  type?: JSX.ButtonHTMLAttributes<HTMLButtonElement>['type'];
}

export const OptionCard: Component<OptionCardProps> = (props) => {
  const [local, rest] = splitProps(props, [
    'class',
    'selected',
    'layout',
    'disabled',
    'children',
    'onClick',
  ]);
  
  const selectedClass = local.selected ? 'option-card--selected' : '';
  const layoutClass = local.layout === 'row' ? 'option-card--row' : local.layout === 'compact' ? 'option-card--compact' : 'option-card--radio';
  
  return (
    <Toolbar.Root style={{ display: 'contents' }}>
      <Toolbar.Button
        type="button"
        disabled={local.disabled}
        focusableWhenDisabled={false}
        class={`option-card ${selectedClass} ${layoutClass} ${local.disabled ? 'option-card--disabled' : ''} ${local.class || ''}`}
        onClick={local.onClick}
        {...rest}
      >
        {local.children}
      </Toolbar.Button>
    </Toolbar.Root>
  );
};

export function optionCardClass(selected: boolean, layout: 'row' | 'radio' | 'compact' = 'radio') {
  const selectedClass = selected ? 'option-card--selected' : '';
  const layoutClass = layout === 'row' ? 'option-card--row' : layout === 'compact' ? 'option-card--compact' : 'option-card--radio';
  return `option-card ${selectedClass} ${layoutClass}`;
}
