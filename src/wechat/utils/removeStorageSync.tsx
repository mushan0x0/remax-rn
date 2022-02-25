import { removeStorageSync } from 'remax/wechat';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fn: typeof removeStorageSync = key => {
  return AsyncStorage.removeItem(key);
};

export default fn;
