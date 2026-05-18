import { Component, JSX, splitProps } from 'solid-js';
import { Progress as BaseProgress } from '@msviderok/base-ui-solid/progress';

export interface ProgressProps {
  value: number;
  minValue?: number;
  maxValue?: number;
  class?: string;
  children?: JSX.Element;
}

type ProgressRoot = Component<ProgressProps> & {
  Track: typeof Track;
  Fill: typeof Fill;
};

const ProgressRoot: Component<ProgressProps> = (props) => {
  const [local, rest] = splitProps(props, ['value', 'minValue', 'maxValue', 'class', 'children']);

  return (
    <BaseProgress.Root
      value={local.value}
      min={local.minValue ?? 0}
      max={local.maxValue ?? 100}
      class={`progress ${local.class || ''}`}
      {...rest}
    >
      {local.children}
    </BaseProgress.Root>
  );
};

const Track: Component<{
  class?: string;
  children?: JSX.Element;
}> = (props) => {
  const [local, rest] = splitProps(props, ['class', 'children']);
  return (
    <BaseProgress.Track class={`progress__track ${local.class || ''}`} {...rest}>
      {local.children}
    </BaseProgress.Track>
  );
};

const Fill: Component<{
  class?: string;
}> = (props) => {
  const [local, rest] = splitProps(props, ['class']);

  return <BaseProgress.Indicator class={`progress__fill ${local.class || ''}`} {...rest} />;
};

export const Progress = Object.assign(ProgressRoot, {
  Track,
  Fill,
}) as ProgressRoot;
