import {LitElement, html, css, unsafeCSS} from 'lit';
import '../mkwc-loading-dots.js';
import {sharedStyles} from '../styles.js';
import './mkwc-loading-img.js';

export const MkwcImageState = {
  NOT_READY: 'not-ready',
  LOADING: 'loading',
  LOADED: 'loaded',
  READY_BUT_NO_SRC: 'ready-but-no-src',
};

export class MkwcImage extends LitElement {
  static properties = {
    // params
    src: String,
    ready: {type: Boolean, reflect: true},
    fit: {type: String, reflect: true}, // 'cover-with-clip', 'cover', 'contain', 'scale-down' or undefined
    presize: {type: Boolean, reflect: true}, //todo Not documented
    // observables
    state: {type: String, reflect: true}, // MkwcImageState
    // private
    _imgLoading: Boolean,
    _imgLoaded: Boolean,
  };
  static styles = [sharedStyles, css`
    :host {
      display: block;
      height: 100%;
    }
    :host(:not([state="${unsafeCSS(MkwcImageState.LOADED)}"])) {
      background: var(--mkwc-image-placeholder-color, var(--_mkwc-placeholder-color));
    }
    :host([presize]:not([state="${unsafeCSS(MkwcImageState.LOADED)}"])) {
      height: 250px;
    }
  `];
  constructor() {
    super();
    this.state = MkwcImageState.NOT_READY;
  }
  willUpdate(changedProperties) {
    if (changedProperties.has('ready') || changedProperties.has('_imgLoading') || changedProperties.has('_imgLoaded')) {
      if (!this.ready) {
        this._setState(MkwcImageState.NOT_READY);
      } else if (!this.src) {
        this._setState(MkwcImageState.READY_BUT_NO_SRC);
      } else if (this._imgLoading) {
        this._setState(MkwcImageState.LOADING);
      } else if (this._imgLoaded) {
        this._setState(MkwcImageState.LOADED);
      }
    }
  }
  _setState(newState) {
    if (this.state !== newState) {
      this.state = newState;
      this.dispatchEvent(new CustomEvent('state-changed', {detail: this.state}));
    }
  }
  render() {
    const activeSrc = this.ready ? this.src : undefined;
    const showImage = this.state === MkwcImageState.LOADED;
    const showLoadingDots = this.state === MkwcImageState.NOT_READY || this.state ===  MkwcImageState.LOADING;
    return html`
      <mkwc-loading-img
        ?hidden=${!showImage}
        .src=${activeSrc}
        .fit=${this.fit}
        @loading-changed=${({detail: loading}) => this._imgLoading = loading}
        @loaded-changed=${({detail: loaded}) => this._imgLoaded = loaded}>
      </mkwc-loading-img>
      <mkwc-loading-dots ?hidden=${!showLoadingDots}></mkwc-loading-dots>
    `;
  }
}
customElements.define('mkwc-image', MkwcImage);
