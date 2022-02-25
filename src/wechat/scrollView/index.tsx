import { ScrollView } from 'react-native';
import transformStyles from '../../utils/transformStyles';
import React, { useEffect, useRef } from 'react';

export default ({ style, scrollTop, ...props }: any) => {
  const scrollRef = useRef<any>();
  useEffect(() => {
    scrollRef.current?.scrollTo?.(scrollTop);
  }, [scrollTop]);
  return (
    <ScrollView
      ref={scrollRef}
      keyboardShouldPersistTaps
      keyboardDismissMode={'on-drag'}
      style={transformStyles(style)}
      {...props}
    />
  );
};
