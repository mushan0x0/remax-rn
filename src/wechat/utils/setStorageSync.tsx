import { setStorageSync } from 'remax/wechat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storage } from './getStorageSync';

const fn: typeof setStorageSync = (key, data) => {
  storage.data[key] = data;
  AsyncStorage.setItem('data', JSON.stringify(storage.data));
  return Promise.resolve();
};

export default fn;
