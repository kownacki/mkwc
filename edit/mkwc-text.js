import {dbSyncMixin} from '../dbSyncMixin.js';
import {MkwcEditableText} from './mkwc-editable-text.js';

export class MkwcText extends dbSyncMixin('text', MkwcEditableText) {}
customElements.define('mkwc-text', MkwcText);
