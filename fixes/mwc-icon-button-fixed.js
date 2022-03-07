import {IconButton as MwcIconButton} from '@material/mwc-icon-button';
import {mwcIconFix} from './mwcIconFix.js';

export class MwcIconButtonFixed extends mwcIconFix(MwcIconButton) {}
customElements.define('mwc-icon-button-fixed', MwcIconButtonFixed);
