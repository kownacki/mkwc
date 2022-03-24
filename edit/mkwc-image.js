import {DbSyncController} from '../DbSyncController.js';
import {MkwcEditableImage} from './mkwc-editable-image.js';

export class MkwcImage extends MkwcEditableImage {
  _dbSync;
  static properties = {
    path: Object, // Parameter passed to getData and updateData
    noGet: Boolean,  // prevent from getting data when path is set
    image: Object,
  };
  firstUpdated(changedProperties) {
    this._dbSync = new DbSyncController(
      this,
      this.getData,
      this.updateData,
      (dataReady) => this.ready = dataReady,
      (data) => this.image = data,
      {noGet: this.noGet},
    );
    this.addEventListener('save', (event) => {
      this._dbSync.requestDataUpdate(event.detail);
    });
    super.firstUpdated(changedProperties);
  }
  willUpdate(changedProperties) {
    if ((changedProperties.has('image') || changedProperties.has('ready')) && this.ready) {
      this.src = this.image?.url;
    }
    super.willUpdate(changedProperties);
  }
  updated(changedProperties) {
    if (changedProperties.has('path')) {
      this._dbSync.setPath(this.path);
    }
  }
}
customElements.define('mkwc-image', MkwcImage);
