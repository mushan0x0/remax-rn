import React from 'react';
import { View } from 'remax/one';
import styles from './index.less';

export default ({ onTap, children, disabled, style }: any) => {
  return (
    <View
      onTap={disabled ? undefined : onTap}
      className={styles.btn}
      style={{
        ...style,
        ...(disabled && styles.disabled),
      }}
    >
      {children}
    </View>
  );
};
