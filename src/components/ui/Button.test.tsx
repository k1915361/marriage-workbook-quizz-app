import { describe, it, expect } from 'vitest';
import { render } from '@solidjs/testing-library';
import { Button } from './Button';

describe('Button', () => {
  it('renders the primary variant by default', () => {
    const { getByRole } = render(() => <Button>Start</Button>);
    const btn = getByRole('button');

    expect(btn.textContent).toBe('Start');
    expect(btn.className).toContain('base-ui-button--primary');
    expect(btn.className).toContain('base-ui-button--default');
  });

  it('renders secondary variant and small size', () => {
    const { getByRole } = render(() => (
      <Button variant="secondary" size="sm">
        Back
      </Button>
    ));
    const btn = getByRole('button');

    expect(btn.className).toContain('base-ui-button--secondary');
    expect(btn.className).toContain('base-ui-button--sm');
  });

  it('renders full width when fullWidth is true', () => {
    const { getByRole } = render(() => (
      <Button fullWidth>Continue</Button>
    ));
    expect(getByRole('button').className).toContain('base-ui-button--full-width');
  });

  it('forwards disabled and type props', () => {
    const { getByRole } = render(() => (
      <Button disabled type="submit">
        Submit
      </Button>
    ));
    const btn = getByRole('button');

    expect(btn).toBeDisabled();
    expect(btn.getAttribute('type')).toBe('submit');
  });
});
