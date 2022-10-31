import {isEqual} from 'lodash-es';

export class DbSyncController {
  _host;
  _path;
  _noGet;
  _getData;
  _updateData;
  _onDataReadyChange;
  _onDataChange;
  _onIsUpdatingChange;
  dataReady;
  data;
  isUpdating;
  constructor(host, getData, updateData, onDataReadyChange, onDataChange, onIsUpdatingChange, options = {}) {
    this._host = host;
    this._getData = getData;
    this._updateData = updateData;
    this._onDataReadyChange = onDataReadyChange;
    this._onDataChange = onDataChange;
    this._onIsUpdatingChange = onIsUpdatingChange;
    this._noGet = options.noGet;
    this.dataReady = false;
    this.isUpdating = false;
    host.addController(this);
  }
  _setDataReady(newDataReady) {
    this.dataReady = newDataReady;
    this._onDataReadyChange?.(this.dataReady);
    if (newDataReady) {
      this._host.dispatchEvent(new CustomEvent('data-ready', {detail: this.data}));
    } else {
      this._host.dispatchEvent(new CustomEvent('data-start-getting'));
    }
    return this.dataReady;
  }
  _setIsUpdating(newIsUpdating) {
    this.isUpdating = newIsUpdating;
    this._onIsUpdatingChange?.(this.isUpdating);
    return this.isUpdating;
  }
  _setLocalData(newData) {
    this.data = newData;
    this._onDataChange?.(this.data);
    return this.data;
  }
  async _syncLocalData() {
    this._setDataReady(false);
    const pathBeforeGettingData = this._path;
    const gotData = await this._getData(this._path);
    if (isEqual(this._path, pathBeforeGettingData)) {
      this._setLocalData(gotData);
      this._setDataReady(true);
    }
  }
  async setPath(newPath) {
    if (!isEqual(this._path, newPath)) {
      this._path = newPath;
      if (!this._noGet) {
        return this._syncLocalData();
      }
    }
  }
  async requestDataUpdate(newData) {
    this._setIsUpdating(true);
    const pathBeforeGettingData = this._path;
    const updatedData = await this._updateData(this._path, newData, this.data);
    if (isEqual(this._path, pathBeforeGettingData)) {
      this._setLocalData(updatedData);
      this._setIsUpdating(false);
      this._host.dispatchEvent(new CustomEvent('data-updated', {detail: this.data}));
    }
    return this.data;
  }
}
