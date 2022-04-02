import {LitElement, html, css} from 'lit';
import {fitAndCompress} from 'mk-frontend-web-utils/fitAndCompress.js';
//import {readBlobOrFile} from 'mk-frontend-web-utils/readBlobOrFile.js';
import '../fixes/mwc-icon-button-fixed.js';
import {sharedStyles} from '../styles.js';
import {MkwcImageState} from './mkwc-image.js';
import './mkwc-image.js';
import './mkwc-image-upload.js';

export class MkwcEditableImage extends LitElement {
  static properties = {
    // mkwc-image params
    src: String,
    ready: {type: Boolean, reflect: true},
    fit: {type: String, reflect: true}, // 'cover-with-clip', 'cover', 'contain', 'scale-down' or undefined
    presize: {type: Boolean, reflect: true}, //todo Not documented
    // new params
    maxWidth: Number,
    maxHeight: Number,
    compressionQuality: Number,
    editingEnabled: Boolean,
    // private
    _showControls: Boolean,
  };
  static styles = [sharedStyles, css`
    :host {
      display: block;
      position: relative;
    }
    mwc-icon-button-fixed {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
      color: white;
      --mdc-icon-fixed-shadow: 0 0 10px
        var(--mkwc-editable-image-icon-button-shadow-color, var(--_mkwc-placeholder-color));
      --mdc-icon-size: 48px;
    }
    :host(:hover) mwc-icon-button-fixed {
      display: flex;
      cursor: pointer;
    }
  `];
  render() {
    return html`
      <mkwc-image
        .src=${this.src}
        .ready=${this.ready}
        .fit=${this.fit}
        .presize=${this.presize}
        @state-changed=${({detail: state}) => {
          this._showControls = state === MkwcImageState.LOADED || state === MkwcImageState.READY_BUT_NO_SRC;
        }}>
      </mkwc-image>
      ${!this.editingEnabled ? '' : html`
        <mkwc-image-upload id="upload"></mkwc-image-upload>
        <mwc-icon-button-fixed
          ?hidden=${!this._showControls}
          .noink=${true}
          .icon=${'image'}
          @click=${async () => {
            if (this.maxHeight && !this.fit) {
              // This case is not supported right now due to ambiguity. 
              // It's not clear whether image should be stretched, cropped or changed at all.
              throw new TypeError(
                'Unsupported parameters combination. "maxHeight" cannot be set without "fit".',
              );
            }
            let file = await this.shadowRoot.getElementById('upload').upload();
            if (file) {
              const blob = await fitAndCompress(
                this.fit === 'contain' ? 'scale-down' : this.fit,
                this.maxWidth,
                this.maxHeight,
                this.compressionQuality,
                file
              );
              this.dispatchEvent(new CustomEvent('image-uploaded', {detail: blob}));
              //this.src = await readBlobOrFile(blob);
            }
          }}>
        </mwc-icon-button-fixed>
      `}
    `;
  }
}
customElements.define('mkwc-editable-image', MkwcEditableImage);
