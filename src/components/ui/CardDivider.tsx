import { Component } from 'solid-js';
import { Separator } from './Separator';

interface CardDividerProps {
  class?: string;
}

export const CardDivider: Component<CardDividerProps> = (props) => {
  return <Separator class={`card-divider ${props.class || ''}`} />;
};
