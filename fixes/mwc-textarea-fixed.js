import {TextArea as MwcTextarea} from '@material/mwc-textarea';
import {mwcTextareaFix} from './mwcTextareaFix.js';

export class MwcTextareaFixed extends mwcTextareaFix(MwcTextarea) {}
customElements.define('mwc-textarea-fixed', MwcTextareaFixed);
