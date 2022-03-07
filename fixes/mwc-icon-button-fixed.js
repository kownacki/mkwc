import {IconButton as MwcIconButton} from '@material/mwc-icon-button';
import mwcIconFix from './mwcIconFix.js';

customElements.define('mwc-icon-button-fixed', class extends mwcIconFix(MwcIconButton) {});
