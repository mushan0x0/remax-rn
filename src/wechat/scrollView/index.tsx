import { ScrollView } from 'react-native';
import transformStyles from '../../utils/transformStyles';
import React, { useEffect, useRef } from 'react';

export default ({
  style,
  scrollTop,
  className,
  onScroll,
  scrollX,
  ...props
}: any) => {
  const scrollRef = useRef<any>();
  useEffect(() => {
    scrollRef.current?.scrollTo?.(scrollTop);
  }, [scrollTop]);
  return (
    <ScrollView
      ref={scrollRef}
      onScroll={({
        nativeEvent: {
          contentOffset: { x, y },
        },
      }) => onScroll?.({ detail: { scrollLeft: x, scrollTop: y } } as any)}
      horizontal={scrollX}
      keyboardShouldPersistTaps
      keyboardDismissMode={'on-drag'}
      style={transformStyles({ ...className, ...style })}
      {...props}
    />
  );
};
