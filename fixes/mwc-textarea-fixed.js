import {TextArea as MwcTextarea} from '@material/mwc-textarea';
import mwcTextareaFix from './mwcTextareaFix.js';

customElements.define('mwc-textarea-fixed', class extends mwcTextareaFix(MwcTextarea) {});
