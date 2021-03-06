import React, {
  useMemo,
  createContext,
  useContext,
  CSSProperties,
  forwardRef,
  useCallback,
  useRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  TouchableOpacity,
  Text as ReactText,
  ScrollView,
  // Platform,
  TextInput,
} from 'react-native';
import styles from './index.less';
import NeedWrap from '../../utils/NeedWrap';
import transformStyles from '../../utils/transformStyles';
import { Grayscale } from 'react-native-color-matrix-image-filters';
import { usePortal } from 'parsec-hooks';
import { rpxToPx } from '@kqinfo/ui';

// @ts-ignore
ReactText.defaultProps = {
  // @ts-ignore
  ...(ReactText.defaultProps || {}),
  allowFontScaling: false,
};
// @ts-ignore
TextInput.defaultProps = {
  // @ts-ignore
  ...(TextInput.defaultProps || {}),
  allowFontScaling: false,
};

const Text = React.forwardRef((props: any, ref: any) => {
  return ref ? (
    <TextInput
      ref={ref}
      {...props}
      style={{
        ...transformStyles(props.style),
        color: props.style?.color || '#000',
        padding: 0,
        height: props.style?.lineHeight,
      }}
    />
  ) : (
    <ReactText {...props} />
  );
});

export const extendStyle = createContext(undefined as any as CSSProperties);

const ChildrenWrap = React.forwardRef(({ children }: any, ref) => {
  const isSrt = ['string', 'number'].includes(typeof children);
  const {
    fontSize = rpxToPx(26),
    color,
    fontWeight,
    textAlign,
    WebkitLineClamp,
    // lineHeight,
  } = useContext(extendStyle);
  return (
    <NeedWrap
      need={isSrt}
      wrap={Text}
      ref={ref}
      wrapProps={{
        className: styles.view,
        editable: false,
        pointerEvents: 'none',
        style: {
          // paddingTop:
          //   lineHeight && fontSize && +lineHeight / +fontSize < 1.2
          //     ? (fontSize as any) *
          //       (Platform.select({
          //         android: 0.2,
          //         ios: 0.1,
          //       }) || 0)
          //     : undefined,
          // lineHeight,
          // height: lineHeight,
          // backgroundColor: 'red',
          fontSize,
          color,
          fontWeight,
          textAlign,
        },
        numberOfLines: WebkitLineClamp,
        ellipsizeMode: 'tail',
      }}
    >
      {children}
    </NeedWrap>
  );
});

export default React.memo(
  forwardRef(
    (
      {
        children,
        onTap,
        onPress,
        style,
        ['active-opacity']: activeOpacity = true,
        ['is-text']: isText = false,
        className = {},
        onLayout,
      }: any,
      ref
    ) => {
      let parentStyle = useContext(extendStyle);
      style = style instanceof Array ? Object.assign({}, ...style) : style;
      style = {
        ...className,
        ...style,
      };
      style.fontSize = style.fontSize || parentStyle?.fontSize;
      style = transformStyles(style);
      const textRef = useRef<any>(null);
      children = useMemo(() => {
        const fn = (children: any) =>
          children instanceof Array ? (
            children.map((item, i) => (
              <ChildrenWrap ref={ref && textRef} key={i}>
                {fn(item)}
              </ChildrenWrap>
            ))
          ) : (
            <ChildrenWrap ref={ref && textRef}>{children}</ChildrenWrap>
          );
        return fn(children);
      }, [children]);
      style = useMemo(() => {
        const obj =
          style instanceof Array ? Object.assign({}, ...style) : style;
        if (['none', 0].includes(obj?.borderBottom)) {
          obj.borderBottomWidth = 0;
          delete obj.borderBottom;
        }
        if (['none', 0].includes(obj?.borderTop)) {
          obj.borderTopWidth = 0;
          delete obj.borderTop;
        }
        return transformStyles({
          flexDirection: parentStyle === undefined ? 'column' : 'row',
          ...obj,
        });
      }, [parentStyle, style]);
      let isFixed = style.position === 'fixed';
      const viewRef = useRef(null);
      useImperativeHandle(ref, () => {
        const getRef = (ref: any) => ({
          current: {
            // @ts-ignore
            ...ref?.current,
            setNativeProps: ({ style, ...props }: any) => {
              style = transformStyles(style);
              // @ts-ignore
              ref?.current?.setNativeProps?.({
                ...props,
                style,
              });
            },
          },
        });
        return {
          view: getRef(viewRef),
          text: getRef(textRef),
        };
      });
      // console.log(JSON.stringify(style));
      parentStyle = {
        ...parentStyle,
        ...style,
      };
      delete style.resize;
      delete style.overflowWrap;
      delete style.pointerEvents;
      delete style.outline;
      delete style.animation;
      delete style.whiteSpace;
      delete style.numberOfLines;
      delete style.WebkitBoxOrient;
      delete style.textOverflow;
      const render = useMemo(() => {
        // console.log(+new Date());
        return (
          <extendStyle.Provider value={parentStyle}>
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
                  ref={ref && (isText ? textRef : viewRef)}
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
                    pointerEvents: parentStyle.pointerEvents,
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
        onLayout,
        onPress,
        onTap,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        JSON.stringify(parentStyle),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        JSON.stringify(style),
      ]);
      usePortal(
        useCallback(
          () => (isFixed ? render : <></>),
          // eslint-disable-next-line react-hooks/exhaustive-deps
          [
            isFixed,
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
          ]
        )
      );
      return isFixed ? null : render;
    }
  )
);
