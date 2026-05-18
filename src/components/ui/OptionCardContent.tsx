import { Component, Show } from 'solid-js';

interface OptionCardContentProps {
  title: string;
  description?: string;
  showArrow?: boolean;
}

export const OptionCardContent: Component<OptionCardContentProps> = (props) => {
  return (
    <>
      <div class="option-card-content__main">
        <span class="option-card-content__title">{props.title}</span>
        <Show when={props.description}>
          <span class="option-card-content__description">{props.description}</span>
        </Show>
      </div>
      <Show when={props.showArrow !== false}>
        <span class="option-card-content__arrow">-&gt;</span>
      </Show>
    </>
  );
};
