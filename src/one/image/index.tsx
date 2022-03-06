import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity } from 'react-native';
// import FastImage from 'react-native-fast-image';
import transformStyles from '../../utils/transformStyles';
import NeedWrap from '../../utils/NeedWrap';
import { SvgXml } from 'react-native-svg';
// @ts-ignore
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';

export default ({ src, className, style = {}, mode, onTap }: any) => {
  style = style instanceof Array ? Object.assign({}, ...style) : style;
  if (style) {
    Object.keys(style).forEach((key) => {
      if (style[key] === undefined) {
        delete style[key];
      }
    });
  }
  style = {
    ...className,
    ...style,
  };
  const [WH, setWH] = useState(style as any);
  const isStr = typeof src === 'string';
  useEffect(() => {
    if (src && mode === 'widthFix') {
      if (isStr) {
        Image.getSize(
          src,
          (width, height) => {
            setWH({ width, height });
          },
          () => {}
        );
      } else {
        setWH(resolveAssetSource(src));
      }
    }
  }, [isStr, mode, src]);
  const { width } = style;
  const multiple = (width || 0) / (WH.width || 0);
  return (
    <NeedWrap
      need={!!onTap}
      wrap={TouchableOpacity}
      wrapProps={{ onPress: onTap }}
    >
      {/svg/.test(src) ? (
        <SvgXml
          {...transformStyles(style as any)}
          xml={src.replace(/ (width|height)="\d+px"/g, ` $1="${width}px"`)}
        />
      ) : (
        <Image
          source={isStr ? { uri: src } : src}
          style={transformStyles({
            height: WH.height ? WH.height * multiple : undefined,
            ...style,
          } as any)}
          resizeMode={mode === 'aspectFit' ? 'contain' : undefined}
        />
      )}
    </NeedWrap>
  );
};
