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
  ScrollView,
} from 'react-native';
import styles from './index.less';
import NeedWrap from '../../utils/NeedWrap';
import transformStyles from '../../utils/transformStyles';
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
    lineHeight,
  } = useContext(extendStyle);
  return (
    <NeedWrap
      need={isSrt}
      wrap={Text}
      wrapProps={{
        className: styles.view,
        style: {
          textAlignVertical: 'center',
          paddingTop:
            lineHeight && fontSize && +lineHeight / +fontSize < 1.2
              ? (fontSize as any) * 0.2
              : undefined,
          lineHeight,
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
  }: any) => {
    const parentStyle = useContext(extendStyle);
    style = style instanceof Array ? Object.assign({}, ...style) : style;
    style = {
      ...className,
      ...style,
    };
    Object.keys(style).forEach((key) => {
      if (style[key] === undefined) {
        delete style[key];
        return;
      }
      if (key === 'lineHeight' && +style[key] && +style[key] < 10) {
        if (+style[key] === 1) {
          style[key] = +(style.fontSize || parentStyle?.fontSize || 16);
        } else {
          style[key] =
            +style[key] *
            +(style.fontSize || parentStyle?.fontSize || 16) *
            1.1;
        }
      }
      if (/em/i.test(style[key])) {
        const number = +style[key].replace(/em/i, '') * 1.1;
        style[key] =
          number *
          (+(typeof style.fontSize
            ? style.fontSize
            : (parentStyle as any)?.fontSize) || rpxToPx(26));
      }
    });
    style = transformStyles(style);
    children = useMemo(
      () =>
        children instanceof Array ? (
          children.map((item, i) => <ChildrenWrap key={i}>{item}</ChildrenWrap>)
        ) : (
          <ChildrenWrap>{children}</ChildrenWrap>
        ),
      [children]
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
  }
);
