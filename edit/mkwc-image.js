import {dbSyncMixin} from '../dbSyncMixin.js'
import {MkwcEditableImage} from './mkwc-editable-image.js';

export class MkwcImage extends dbSyncMixin('image', MkwcEditableImage) {
  static get properties() {
    return {
      image: Object,
    };
  }
  constructor() {
    super();
    this.addEventListener('data-updated', async (event) => this.image = event.detail);
  }
  willUpdate(changedProperties) {
    if (changedProperties.has('dataReady')) {
      this.ready = this.dataReady;
    }
    if ((changedProperties.has('image') || changedProperties.has('ready')) && this.ready) {
      this.src = this.image?.url;
    }
    super.willUpdate(changedProperties);
  }
}
customElements.define('mkwc-image', MkwcImage);
