import {css} from 'lit';

// 1. Allows adding icon shadow
export default (MwcIcon) =>
  class extends MwcIcon {
    static get styles() {
      return [super.styles, css`
        button {
          text-shadow: var(--mdc-icon-fixed-shadow);
        }
      `];
    }
  };
