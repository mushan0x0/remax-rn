import { useIsFocused } from '@react-navigation/native';
// @ts-ignore
import { usePageEvent } from 'remax/macro';
import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

const Fn: typeof usePageEvent = (eventName, callback) => {
  const isFocused = useIsFocused();
  useEffect(() => {
    if (eventName === 'onShow' && isFocused) {
      callback();
    } else if (eventName === 'onHide' && !isFocused) {
      callback();
    } else if (eventName === 'onLoad') {
      callback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventName, isFocused]);
  useEffect(() => {
    const fn = (state: AppStateStatus) => {
      if (state === 'active' && isFocused) {
        callback();
      }
    };
    const event = AppState.addEventListener('change', fn);
    return () => {
      event.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);
};

export default Fn;
