import {LitElement, html, css} from 'lit';
import '../mkwc-loading-dots.js';
import {sharedStyles} from '../styles.js';
import './mkwc-loading-img.js';

export class MkwcImage extends LitElement {
  static properties = {
    // params
    src: String,
    ready: {type: Boolean, reflect: true},
    fit: {type: String, reflect: true}, // 'cover-with-clip', 'cover', 'contain', 'scale-down' or undefined
    presize: {type: Boolean, reflect: true}, //todo Not documented
    // observables
    loading: {type: Boolean, reflect: true}, //todo Not documented
    showImage: {type: Boolean, reflect: true, attribute: 'show-image'},
    notFound: {type: Boolean, reflect: true, attribute: 'not-found'},
  };
  static styles = [sharedStyles, css`
    :host {
      display: block;
      height: 100%;
    }
    :host(:not([show-image])), :host([not-found]) {
      background: var(--mkwc-image-placeholder-color, var(--_mkwc-placeholder-color));
    }
    :host([presize]:not([show-image])), :host([presize][not-found]) {
      height: 250px;
    }
  `];
  willUpdate(changedProperties) {
    if (changedProperties.has('ready') || changedProperties.has('loading')) {
      this._setShowImage(this.ready && !this.loading);
    }
    if (changedProperties.has('ready') || changedProperties.has('src')) {
      this._setNotFound(this.ready && !this.src);
    }
  }
  _setLoading(value) {
    if (this.loading !== value) {
      this.loading = value;
      this.dispatchEvent(new CustomEvent('loading-changed', {detail: this.loading}));
    }
  }
  _setShowImage(value) {
    if (this.showImage !== value) {
      this.showImage = value;
      this.dispatchEvent(new CustomEvent('show-image-changed', {detail: this.showImage}));
    }
  }
  _setNotFound(value) {
    if (this.notFound !== value) {
      this.notFound = value;
      this.dispatchEvent(new CustomEvent('not-found-changed', {detail: this.notFound}));
    }
  }
  render() {
    const activeSrc = this.ready ? this.src : undefined;
    return html`
      <mkwc-loading-img
        ?hidden=${!this.showImage}
        .src=${activeSrc}
        .fit=${this.fit}
        @loading-started=${() => this._setLoading(true)}
        @loading-ended=${() => this._setLoading(false)}>
      </mkwc-loading-img>
      <mkwc-loading-dots ?hidden=${this.showImage}></mkwc-loading-dots>
    `;
  }
}
customElements.define('mkwc-image', MkwcImage);
