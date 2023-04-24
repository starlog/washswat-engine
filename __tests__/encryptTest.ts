import {encryptObject,decryptObject} from '../src/util2';
import {decryptObjectWithSingleKey, encryptObjectWithSingleKey} from "../lib/util2";

function encryptDecryptTest() {
  try {
    const sourceData = {
      data: 'test',
      value: 1,
      isTrue: true,
    };
    const key = 'IsDoomsdayAlreadyHere?';
    const iv = 'I don\'t know';

    const sourceDataString = JSON.stringify(sourceData);

    const encryptedData = encryptObject(sourceData, key, iv);
    const decryptedData = decryptObject(encryptedData, key, iv);
    const decryptedDataString = JSON.stringify(decryptedData);

    return sourceDataString === decryptedDataString;
  } catch (ex) {
    return false;
  }
}

function encryptDecryptTest2() {
  try {
    const sourceData = {
      data: 'test',
      value: 1,
      isTrue: true,
    };
    const keyAndIv = 'I will be back?';

    const sourceDataString = JSON.stringify(sourceData);

    const encryptedData = encryptObjectWithSingleKey(sourceData, keyAndIv);
    const decryptedData = decryptObjectWithSingleKey(encryptedData, keyAndIv);
    const decryptedDataString = JSON.stringify(decryptedData);

    return sourceDataString === decryptedDataString;
  } catch (ex) {
    return false;
  }
}


describe('encrypt test module', () => {
  test('encrypt/decrypt test1', () => {
    expect(encryptDecryptTest()).toBe(true);
  });
  test('encrypt/decrypt test2', () => {
    expect(encryptDecryptTest2()).toBe(true);
  });
});
