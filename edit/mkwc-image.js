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
    this.addEventListener('updated', async (event) => this.image = event.detail);
  }
  updated(changedProperties) {
    if (changedProperties.has('image')) {
      this.src = _.get('url', this.image);
      this.ready = true;
    }
    super.updated(changedProperties);
  }
}
customElements.define('mkwc-image', MkwcImage);
