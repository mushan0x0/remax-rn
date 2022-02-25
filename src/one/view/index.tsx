import React, {
  useMemo,
  createContext,
  useContext,
  CSSProperties,
  useCallback,
} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import styles from './index.less';
import NeedWrap from '../../utils/NeedWrap';
import transformStyles from '../../utils/transformStyles';
// @ts-ignore
import isNumber from 'is-number';
import { Grayscale } from 'react-native-color-matrix-image-filters';
import { usePortal } from 'parsec-hooks';
import { rpxToPx } from '@kqinfo/ui';

export const extendStyle = createContext(undefined as any as CSSProperties);

const win = Dimensions.get('window');

const ChildrenWrap = ({ children }: any) => {
  const isSrt = ['string', 'number'].includes(typeof children);
  const {
    fontSize = rpxToPx(26),
    color,
    fontWeight,
    textAlign,
    textOverflow,
    WebkitLineClamp,
    lineHeight = (fontSize ? (fontSize as any) * 1.3 : fontSize) as any,
  } = useContext(extendStyle);
  const newlineHeight = lineHeight === 1 ? fontSize : lineHeight;
  return (
    <NeedWrap
      need={isSrt}
      wrap={Text}
      wrapProps={{
        className: styles.view,
        style: {
          textAlignVertical: 'center',
          // paddingTop: lineHeight === 1 ? (fontSize as any) * 0.1 : undefined,
          ...Platform.select({
            ios: {
              lineHeight: newlineHeight * 1.1,
            },
            android: {},
          }),
          fontSize,
          color,
          fontWeight,
          textAlign,
        },
        ...(textOverflow || WebkitLineClamp
          ? { numberOfLines: WebkitLineClamp || 1, ellipsizeMode: 'tail' }
          : {}),
      }}
    >
      {children}
    </NeedWrap>
  );
};

export default React.memo(
  ({
    children,
    onTap,
    onPress,
    style,
    ['active-opacity']: activeOpacity = true,
    ['is-text']: isText = false,
    className = {},
    onLayout,
    ...props
  }: any) => {
    const parentStyle = useContext(extendStyle);
    style = style instanceof Array ? Object.assign({}, ...style) : style;
    if (style) {
      Object.keys(style).forEach((key) => {
        if (style[key] === undefined) {
          delete style[key];
        }
      });
    }
    style = transformStyles({
      ...className,
      ...style,
    });
    Object.keys(style).forEach((key) => {
      if (/em/i.test(style[key])) {
        const number = +style[key].replace(/em/i, '') * 1.1;
        style[key] =
          number *
          (+(typeof style.fontSize
            ? style.fontSize
            : (parentStyle as any)?.fontSize) || rpxToPx(26));
      }
    });
    children = useMemo(
      () =>
        children instanceof Array ? (
          children.map((item, i) => <ChildrenWrap key={i}>{item}</ChildrenWrap>)
        ) : (
          <ChildrenWrap>{children}</ChildrenWrap>
        ),
      [children],
    );
    style = useMemo(() => {
      const obj = style instanceof Array ? Object.assign({}, ...style) : style;
      if (['none', 0].includes(obj?.borderBottom)) {
        obj.borderBottomWidth = 0;
        delete obj.borderBottom;
      }
      if (['none', 0].includes(obj?.borderTop)) {
        obj.borderTopWidth = 0;
        delete obj.borderTop;
      }
      const { borderRadius } = obj || {};
      return transformStyles({
        flexDirection: parentStyle === undefined ? 'column' : 'row',
        ...obj,
        borderRadius: borderRadius?.includes?.('%')
          ? (((!(parentStyle as any)?.width?.includes?.('%') &&
              (parentStyle as any)?.width) ||
              win.width) *
              +borderRadius.replace('%', '')) /
            100
          : borderRadius,
      });
    }, [parentStyle, style]);
    let isFixed = style.position === 'fixed';
    // console.log(JSON.stringify(style));
    const render = useMemo(() => {
      // console.log(+new Date());
      return (
        <extendStyle.Provider
          value={{
            ...parentStyle,
            ...style,
          }}
        >
          <NeedWrap
            wrap={ScrollView}
            need={['scroll', 'auto'].includes(style?.overflow)}
            wrapProps={{
              style: { height: style.height, flex: style.flex },
              nestedScrollEnabled: true,
            }}
          >
            <NeedWrap
              need={style?.filter?.includes('grayscale')}
              wrap={Grayscale}
            >
              <NeedWrap
                wrap={
                  onTap || onPress ? TouchableOpacity : isText ? Text : View
                }
                need
                wrapProps={{
                  className: styles.view,
                  onLayout,
                  onPress: (e: any) => {
                    onTap?.(e);
                    onPress?.(e);
                  },
                  activeOpacity: activeOpacity ? 0.5 : 1,
                  style: {
                    ...style,
                    opacity: style.opacity,
                    position: isFixed ? 'absolute' : style.position,
                  },
                  pointerEvents: style.pointerEvents,
                }}
              >
                {children}
              </NeedWrap>
            </NeedWrap>
          </NeedWrap>
        </extendStyle.Provider>
      );
    }, [
      activeOpacity,
      children,
      isFixed,
      isText,
      // onLayout,
      // onPress,
      // onTap,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(parentStyle),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(style),
    ]);
    usePortal(useCallback(() => (isFixed ? render : <></>), [isFixed, render]));
    return isFixed ? null : render;
  },
);
