/**
 * @jest-environment jsdom
 */
import {jest} from '@jest/globals';
import {sleep} from 'mk-js-utils';
import {DbSyncController} from './DbSyncController.js';

const hostMock = {
  addController: jest.fn().mockName('addController'),
  dispatchEvent: jest.fn().mockName('dispatchEvent'),
};

const createStubs = () => ({
  pathStub: {value: 'path-stub'},
  newPathStub: {value: 'new-path-stub'},
  dataStub: {value: 'data-stub'},
  newDataStub: {value: 'new-data-stub'},
  oldDataStub: {value: 'old-data-stub'},
  updatedDataStub: {value: 'updated-data-stub'},
});

const createDbSyncControllerFixture = (dbSyncControllerOptions) => {
  const onDataReadyChangeMock = jest.fn().mockName('onDataReadyChangeMock');
  const onDataChangeMock = jest.fn().mockName('onDataChangeMock');
  const onIsUpdatingChangeMock = jest.fn().mockName('onIsUpdatingChangeMock');
  const getDataMock = jest.fn().mockName('getDataMock');
  const updateDataMock = jest.fn().mockName('updateDataMock');

  const dbSyncController = new DbSyncController(
    hostMock,
    {
      getData: getDataMock,
      updateData: updateDataMock,
      onDataReadyChange: onDataReadyChangeMock,
      onDataChange: onDataChangeMock,
      onIsUpdatingChange: onIsUpdatingChangeMock,
    },
    dbSyncControllerOptions,
  );

  return {
    dbSyncController,
    onDataReadyChangeMock,
    onDataChangeMock,
    onIsUpdatingChangeMock,
    getDataMock,
    updateDataMock,
  };
};

const expectDataReadyChange = (fixture, newValue) => {
  expect(fixture.dbSyncController.dataReady).toBe(newValue);
  expect(fixture.onDataReadyChangeMock).toBeCalledWith(newValue);
};

const expectDataReadyNotToBeChanged = (fixture, oldValue = false) => {
  expect(fixture.dbSyncController.dataReady).toBe(oldValue);
  expect(fixture.onDataReadyChangeMock).not.toBeCalled();
};

const expectDataChange = (fixture, newValue) => {
  expect(fixture.dbSyncController.data).toBe(newValue);
  expect(fixture.onDataChangeMock).toBeCalledWith(newValue);
};

const expectDataNotToBeChanged = (fixture, oldValue = undefined) => {
  expect(fixture.dbSyncController.data).toBe(oldValue);
  expect(fixture.onDataChangeMock).not.toBeCalled();
};

// todo test emitting events
describe('DbSyncController', () => {
  it('Gets data', async () => {
    const fixture = createDbSyncControllerFixture();
    const stubs = createStubs();
    fixture.getDataMock.mockResolvedValue(stubs.dataStub);

    const setPathPromise = fixture.dbSyncController.setPath(stubs.pathStub);

    expectDataReadyChange(fixture, false);
    expect(fixture.getDataMock).toBeCalledWith(stubs.pathStub);
    await setPathPromise;
    expectDataChange(fixture, stubs.dataStub);
    expectDataReadyChange(fixture, true);
  });

  it('Doesn\'t get data if option noGet is set', async () => {
    const fixture = createDbSyncControllerFixture({noGet: true});
    const stubs = createStubs();
    fixture.getDataMock.mockResolvedValue(stubs.dataStub);

    const setPathPromise = fixture.dbSyncController.setPath(stubs.pathStub);

    expectDataReadyNotToBeChanged(fixture);
    await setPathPromise;
    expectDataNotToBeChanged(fixture);
    expectDataReadyNotToBeChanged(fixture);
  });

  it('Gets data but skips setting it if path changed in the meantime but sets new data', async () => {
    const fixture = createDbSyncControllerFixture();
    const stubs = createStubs();
    fixture.getDataMock.mockImplementation(async (path) => {
      if (path === stubs.pathStub) {
        return stubs.dataStub;
      } else { // path === stubs.newPathStub
        await sleep();
        return Promise.resolve(stubs.newDataStub)
      }
    });

    const setPathPromise = fixture.dbSyncController.setPath(stubs.pathStub);
    const setNewPathPromise = fixture.dbSyncController.setPath(stubs.newPathStub);

    await setPathPromise;
    expectDataNotToBeChanged(fixture);
    await setNewPathPromise;
    expectDataChange(fixture, stubs.newDataStub);
  });

  it('Updates data', async () => {
    const fixture = createDbSyncControllerFixture({noGet: true});
    const stubs = createStubs();
    fixture.updateDataMock.mockResolvedValue(stubs.updatedDataStub);

    await fixture.dbSyncController.setPath(stubs.pathStub);
    fixture.dbSyncController.data = stubs.oldDataStub;
    const requestDataUpdatePromise = fixture.dbSyncController.requestDataUpdate(stubs.newDataStub);

    expect(fixture.onIsUpdatingChangeMock).toBeCalledWith(true);
    expect(fixture.updateDataMock).toBeCalledWith(stubs.pathStub, stubs.newDataStub, stubs.oldDataStub);
    await requestDataUpdatePromise;
    expectDataChange(fixture, stubs.updatedDataStub);
    expect(fixture.onIsUpdatingChangeMock).toBeCalledWith(false);
  });

  it('Updates data but skips setting it if path changed in the meantime', async () => {
    const fixture = createDbSyncControllerFixture({noGet: true});
    const stubs = createStubs();

    await fixture.dbSyncController.setPath(stubs.pathStub);
    fixture.dbSyncController.data = stubs.oldDataStub;
    const requestDataUpdatePromise = fixture.dbSyncController.requestDataUpdate(stubs.newDataStub);
    const setNewPathPromise = fixture.dbSyncController.setPath(stubs.newPathStub);

    await requestDataUpdatePromise;
    expectDataNotToBeChanged(fixture, stubs.oldDataStub);
    await setNewPathPromise;
  });
});
