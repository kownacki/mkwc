import {LitElement, html, css, unsafeCSS} from 'lit';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import {loadingDots} from 'mk-frontend-web-utils/loadingDots.js';

export class MkwcLoadingDots extends LitElement {
  static get properties() {
    return {};
  }
  static get styles() {
    return css`
      :host {
        display: block;
        position: relative;
      }
      ${unsafeCSS(loadingDots.css(true))}
    `;
  }
  render() {
    return html`
      ${unsafeHTML(loadingDots.html())}
    `;
  }
}
customElements.define('mkwc-loading-dots', MkwcLoadingDots);
