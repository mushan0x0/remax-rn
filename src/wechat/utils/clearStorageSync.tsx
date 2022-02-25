import { clearStorageSync } from 'remax/wechat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storage } from './getStorageSync';

const fn: typeof clearStorageSync = () => {
  storage.data = {};
  return AsyncStorage.clear();
};

export default fn;
