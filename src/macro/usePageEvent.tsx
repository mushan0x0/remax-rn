import { useIsFocused } from '@react-navigation/native';
import { usePageEvent } from 'remax/macro';
import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

const Fn: typeof usePageEvent = (eventName, callback) => {
  const isFocused = useIsFocused();
  useEffect(() => {
    if (eventName === 'onShow' && isFocused) {
      callback();
    } else if (eventName === 'onLoad') {
      callback();
    }
  }, [eventName, isFocused]);
  useEffect(() => {
    const fn = (state: AppStateStatus) => {
      if (state === 'active' && isFocused) {
        callback();
      }
    };
    AppState.addEventListener('change', fn);
    return () => {
      AppState.removeEventListener('change', fn);
    };
  }, [isFocused]);
};

export default Fn;
