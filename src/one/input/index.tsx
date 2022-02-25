import { TextInput } from 'react-native';
import React, { forwardRef, useContext } from 'react';
import { View } from 'remax/one';
import transformStyles from '../../utils/transformStyles';
import { rpxToPx } from '@kqinfo/ui';
import { extendStyle } from '../view';

const Input = ({ style, ...props }: any) => {
  const {
    fontSize = rpxToPx(26),
    textAlign,
    ...parentStyle
  } = useContext(extendStyle);
  Object.keys(style).forEach((key) => {
    if (/em/i.test(style[key])) {
      const number = style[key].replace(/em/i, '');
      style[key] =
        +number *
        ((+typeof style.fontSize ? style.fontSize : fontSize) || rpxToPx(26));
    }
  });
  return <TextInput style={{ textAlign, ...style }} {...props} />;
};

export default forwardRef(
  (
    {
      style,
      className,
      placeholderStyle,
      onInput,
      onChange,
      onConfirm,
      type,
      ...props
    }: any,
    ref,
  ) => {
    if (type === 'number') {
      type = 'number-pad';
    } else {
      type = 'default';
    }
    const viewStyle = { ...className, ...style };
    return (
      <View style={viewStyle}>
        <Input
          style={transformStyles({
            backgroundColor: '#fff',
            paddingLeft: 0,
            paddingRight: 0,
            paddingTop: 0,
            paddingBottom: 0,
            fontSize: viewStyle.fontSize,
            ...className,
            ...style,
          })}
          underlineColorAndroid="transparent"
          placeholderTextColor={
            placeholderStyle?.color || style?.color || '#999'
          }
          onChangeText={(text: any) => {
            onInput?.({ target: { value: text } });
            onChange?.(text);
          }}
          onSubmitEditing={onConfirm}
          keyboardType={type}
          ref={ref}
          returnKeyType={'done'}
          {...props}
        />
      </View>
    );
  },
);
