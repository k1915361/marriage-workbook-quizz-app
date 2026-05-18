import { Component, JSX } from 'solid-js';
import { RadioGroup } from './RadioGroup';
import { optionCardClass } from './OptionCard';

interface RadioOptionProps {
  value: string;
  selected: boolean;
  label: JSX.Element;
}

export const RadioOption: Component<RadioOptionProps> = (props) => {
  return (
    <RadioGroup.Item value={props.value} class={optionCardClass(props.selected, 'radio')}>
      <RadioGroup.ItemControl class={`radio-option__control ${props.selected ? 'radio-option__control--selected' : ''}`}>
        <RadioGroup.ItemIndicator class="radio-option__indicator" />
      </RadioGroup.ItemControl>
      <RadioGroup.ItemLabel class={`radio-option__label ${props.selected ? 'radio-option__label--selected' : ''}`}>
        {props.label}
      </RadioGroup.ItemLabel>
    </RadioGroup.Item>
  );
};
