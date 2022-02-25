import { getStorageSync } from 'remax/wechat';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  data: {} as any,
};

AsyncStorage.getItem('data').then(
  (data) => (storage.data = data ? JSON.parse(data) : {})
);

const fn: typeof getStorageSync = (key) => {
  return storage.data[key];
};

export default fn;
