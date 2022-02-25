import { TextInput } from 'react-native';
import React from 'react';
import styles from './index.less';

export default ({ style, onInput, onChange, ...props }: any) => {
  return (
    <TextInput
      textAlignVertical={'top'}
      style={{ ...styles.input, ...style }}
      {...props}
      onChangeText={(text) => {
        onInput?.({ target: { value: text } });
        onChange?.(text);
      }}
      underlineColorAndroid="transparent"
      multiline={true}
    />
  );
};
