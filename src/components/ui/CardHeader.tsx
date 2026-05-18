import { Component, JSX, Show } from 'solid-js';

interface CardHeaderProps {
  title: JSX.Element;
  description?: JSX.Element;
  class?: string;
}

export const CardHeader: Component<CardHeaderProps> = (props) => {
  return (
    <div class={`card-header ${props.class || ''}`}>
      <h3 class="card-header__title">{props.title}</h3>
      <Show when={props.description}>
        <p class="card-header__description">{props.description}</p>
      </Show>
    </div>
  );
};
