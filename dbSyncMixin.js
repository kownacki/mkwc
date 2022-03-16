export const dbSyncMixin = (dataPropName, Class) =>
  class extends Class {
    static get properties() {
      return {
        // required params
        path: Object, // Parameter passed to get and update
        getData: Function,
        updateData: Function,
        // optional params
        noGet: Boolean, // prevent from getting data when path is set
        // observables
        dataReady: Boolean,
      };
    }
    constructor(...args) {
      super(...args);
      this.addEventListener('save', async (event) => {
        const updatedData = await this.updateData(this.path, event.detail, this[dataPropName]);
        this.dispatchEvent(new CustomEvent('updated', {detail: updatedData}));
      });
    }
    updated(changedProperties) {
      if (changedProperties.has('path') && this.path && !this.noGet) {
        (async () => {
          this[dataPropName] = await this.getData(this.path);
          this.dataReady = true;
          this.dispatchEvent(new CustomEvent('data-ready', {detail: this[dataPropName], composed: true}));
        })();
      }
      super.updated(changedProperties);
    }
  };
