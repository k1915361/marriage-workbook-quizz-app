import { Component, JSX } from 'solid-js';

interface PageShellProps {
  children: JSX.Element;
  class?: string;
  centered?: boolean;
  maxWidth?: 'lg' | '2xl' | 'full';
}

export const PageShell: Component<PageShellProps> = (props) => {
  const maxWidthClass = props.maxWidth === 'lg' ? 'page-shell--max-w-lg' : props.maxWidth === '2xl' ? 'page-shell--max-w-2xl' : 'page-shell--max-w-full';
  
  return (
    <div
      class={`page-shell ${props.centered !== false ? 'page-shell--centered' : ''} ${props.class || ''}`}
    >
      {props.maxWidth ? (
        <div class={`page-shell__container ${maxWidthClass}`}>{props.children}</div>
      ) : (
        props.children
      )}
    </div>
  );
};
