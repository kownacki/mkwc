import {css} from 'lit';

// 1. Allows adding icon shadow
// 2. Allows adding size transition
export const mwcIconFix = (MwcIcon) =>
  class extends MwcIcon {
    static get styles() {
      return [super.styles, css`
        :host, i {
          text-shadow: var(--mdc-icon-fixed-shadow);
          transition: font-size var(--mdc-icon-fixed-size-transition);
          transition-property: font-size, width, height;
        }
      `];
    }
  };
