import {css, unsafeCSS} from 'lit';
import materialColors from 'material-colors';

export const sharedStyles = css`
  :host {
    --_mkwc-placeholder-color: var(--mkwc-placeholder-color, ${unsafeCSS(materialColors.grey['400'])});
  }
`;
