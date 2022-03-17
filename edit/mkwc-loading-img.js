import {LitElement, html, css} from 'lit';
import {ifDefined} from 'lit/directives/if-defined.js';

/**
 * Dispatches 'loading-started' and 'loading-ended' events and stores loading state as reflected property.
 * Native 'loadstart' and 'loadend' don't work on regular img. See https://bugs.chromium.org/p/chromium/issues/detail?id=458851
 * Also doesn't start loading when `src` is undefined or null.
 */
export class MkwcLoadingImg extends LitElement {
  static get properties() {
    return {
      src: String,
      fit: {type: String, reflect: true},
      loading: {type: Boolean, reflect: true},
    };
  }
  static get styles() {
    return css`
      :host(:not([ready])) .image, :host([loading]) .image {
        opacity: 50%;
      }
      img {
        display: block;
        width: 100%;
      }
      :host([fit]) img {
        height: 100%;
      }
      :host([fit="cover"]) img, :host([fit="cover-with-clip"]) img {
        object-fit: cover;
      }
      :host([fit="contain"]) img {
        object-fit: contain;
      }
      :host([fit="scale-down"]) img {
        object-fit: scale-down;
      }
    `;
  }
  constructor() {
    super();
    this.loading = false;
  }
  _startLoading() {
    this.loading = true;
    this.dispatchEvent(new CustomEvent('loading-started'));
  }
  _endLoading() {
    if (this.loading) {
      this.loading = false;
      this.dispatchEvent(new CustomEvent('loading-ended'));
    }
  }
  updated(changedProperties) {
    if (changedProperties.has('src')) {
      if (this.src !== undefined && this.src !== null) {
        this._startLoading();
      } else {
        this._endLoading();
      }
    }
  }
  render() {
    return html`
      <img
        src=${ifDefined(this.src)}
        @load=${this._endLoading}
        @error=${this._endLoading}>
    `;
  }
}
customElements.define('mkwc-loading-img', MkwcLoadingImg);
