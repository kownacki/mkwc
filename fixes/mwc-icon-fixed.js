import {Icon as MwcIcon} from '@material/mwc-icon';
import {mwcIconFix} from './mwcIconFix.js';

export class MwcIconFixed extends mwcIconFix(MwcIcon) {}
customElements.define('mwc-icon-fixed', MwcIconFixed);
