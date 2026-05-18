import { Component, JSX, splitProps } from 'solid-js';
import { RadioGroup as BaseRadioGroup } from '@msviderok/base-ui-solid/radio-group';
import { Radio } from '@msviderok/base-ui-solid/radio';

type RadioGroupRoot = Component<{
  value?: string;
  onChange: (value: string) => void;
  class?: string;
  children: JSX.Element;
}> & {
  Item: typeof Item;
  ItemControl: typeof ItemControl;
  ItemIndicator: typeof ItemIndicator;
  ItemLabel: typeof ItemLabel;
};

const RadioGroupRoot: Component<{
  value?: string;
  onChange: (value: string) => void;
  class?: string;
  children: JSX.Element;
}> = (props) => {
  const [local, rest] = splitProps(props, ['value', 'onChange', 'class', 'children']);
  return (
    <BaseRadioGroup
      value={local.value || ''}
      onValueChange={(value) => local.onChange(String(value))}
      class={`radio-group ${local.class || ''}`}
      {...rest}
    >
      {local.children}
    </BaseRadioGroup>
  );
};

const Item: Component<{
  value: string;
  class?: string;
  children: JSX.Element;
}> = (props) => {
  const [local, rest] = splitProps(props, ['value', 'class', 'children']);

  return (
    <Radio.Root
      value={local.value}
      class={`radio-group__item ${local.class || ''}`}
      {...rest}
    >
      {local.children}
    </Radio.Root>
  );
};

const ItemControl: Component<{
  class?: string;
  children: JSX.Element;
}> = (props) => {
  const [local, rest] = splitProps(props, ['class', 'children']);
  return (
    <div class={`radio-group__control ${local.class || ''}`} {...rest}>
      {local.children}
    </div>
  );
};

const ItemIndicator: Component<{
  class?: string;
}> = (props) => {
  const [local, rest] = splitProps(props, ['class']);
  return <Radio.Indicator class={`radio-group__indicator ${local.class || ''}`} {...rest} />;
};

const ItemLabel: Component<{
  class?: string;
  children: JSX.Element;
}> = (props) => {
  const [local, rest] = splitProps(props, ['class', 'children']);
  return (
    <div class={`radio-group__label ${local.class || ''}`} {...rest}>
      {local.children}
    </div>
  );
};

export const RadioGroup = Object.assign(RadioGroupRoot, {
  Item,
  ItemControl,
  ItemIndicator,
  ItemLabel,
}) as RadioGroupRoot;
