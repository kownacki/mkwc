import {LitElement, html, css} from 'lit';
import {upload} from 'mk-frontend-web-utils/upload.js';

export class MkwcImageUpload extends LitElement {
  static get properties() {
    return {
    };
  }
  static get styles() {
    return css`
      :host {
        display: none;
      }
    `;
  }
  async upload() {
    return upload();
  }
  render() {
    return html`
    `;
  }
}
customElements.define('mkwc-image-upload', MkwcImageUpload);
