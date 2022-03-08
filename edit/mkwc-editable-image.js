import {LitElement, html, css} from 'lit';
import {fitAndCompress} from 'mk-frontend-web-utils/fitAndCompress.js';
import {readBlobOrFile} from 'mk-frontend-web-utils/readBlobOrFile.js';
import '../fixes/mwc-icon-button-fixed.js';
import '../mkwc-loading-dots.js';
import {sharedStyles} from '../styles.js';
import './mkwc-image-upload.js';

export class MkwcEditableImage extends LitElement {
  static get properties() {
    return {
      src: {type: Boolean, reflect: true, attribute: 'not-empty'},
      ready: {type: Boolean, reflect: true},
      fit: {type: String, reflect: true}, // 'cover', 'contain', 'scale-down' or undefined
      maxWidth: Number,
      maxHeight: Number,
      compressionQuality: Number,
      presize: {type: Boolean, reflect: true},
      lowerImage: {type: Boolean, reflect: true, attribute: 'lower-image'},
      editingEnabled: Boolean,
    };
  }
  static get styles() {
    return [sharedStyles, css`
      :host {
        display: block;
      }
      :host(:not([ready])) {
        opacity: 50%;
      }
      .container {
        position: relative;
        height: 100%;
      }
      :host(:not([not-empty])) .container {
        background: var(--mkwc-editable-image-placeholder-color, var(--_mkwc-placeholder-color));
      }
      :host([presize]:not([not-empty])) {
        height: 250px;
      }
      img {
        display: block;
        width: 100%;
      }
      :host([fit]) img {
        height: 100%;
      }
      :host([fit="cover"]) img {
        object-fit: cover;
      }
      :host([fit="contain"]) img {
        object-fit: contain;
      }
      :host([fit="scale-down"]) img {
        object-fit: scale-down;
      }
      :host([lower-image]) ::slotted {
        z-index: -1;
      }
      input {
        display: none;
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
        --mdc-icon-fixed-shadow: 0 0 10px var(--mkwc-editable-image-icon-button-shadow-color);
        --mdc-icon-size: 48px;
      }
      .container:hover mwc-icon-button-fixed {
        display: flex;
        cursor: pointer;
      }
    `];
  }
  render() {
    return html`
      <div class="container">
        ${this.ready ? '' : html`<mkwc-loading-dots></mkwc-loading-dots>`}
        ${!this.src ? '' : html`<img class="image" .src=${this.src}>`}
        ${!this.editingEnabled || !this.ready ? '' : html`
          <mkwc-image-upload id="upload"></mkwc-image-upload>
          <mwc-icon-button-fixed
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
                this.dispatchEvent(new CustomEvent('save', {detail: blob}));
                this.src = await readBlobOrFile(blob);           
              }
            }}>
          </mwc-icon-button-fixed>
        `}
      </div>
    `;
  }
}
