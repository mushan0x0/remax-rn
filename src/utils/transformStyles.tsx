import React from 'react';
import { Dimensions } from 'react-native';
// @ts-ignore
import { transform } from 'css-viewport-units-transform';
import appData from '@/appData';
// @ts-ignore
import { getUnitRegexp, createPxReplace } from './pxToVw';
// @ts-ignore
import transformCSS from 'css-to-react-native';
import { NativeModules } from 'react-native';
const { StatusBarManager } = NativeModules;

let statusBarHeight = 0;

StatusBarManager.getHeight?.((statusBarFrameData: any) => {
  statusBarHeight = statusBarFrameData.height;
});

type Styles = { [key: string]: React.CSSProperties };

const win = Dimensions.get('window');

export default (
  { ...styles }: Styles = {},
  ...arg: (string | false | { [key: string]: boolean } | undefined)[]
) => {
  let CSSObj: any =
    arg.length === 0
      ? styles
      : Object.assign(
          {},
          ...arg
            .filter((item) => item)
            .map((item = '') => {
              return typeof item === 'string'
                ? item.split(' ')
                : Object.keys(item).filter((key) => (item as any)[key]);
            })
            .flat()
            .map((key: any) => (styles as any)[key])
        );
  if (CSSObj[0]) {
    const fn = (count: number) => {
      if (CSSObj[count]) {
        CSSObj = {
          ...CSSObj,
          ...CSSObj[count],
        };
        delete CSSObj[count];
      }
      if (CSSObj[count + 1]) {
        fn(count + 1);
      }
    };
    fn(0);
  }
  if (CSSObj.overflow === 'auto') {
    CSSObj.overflow = 'scroll';
    CSSObj.height = undefined;
  }
  if (CSSObj.display !== 'none') {
    CSSObj.display = 'flex';
  }
  if (CSSObj.flexDirection === 'column' || CSSObj.alignItems === 'center') {
    CSSObj.flexWrap = 'nowrap';
  } else if (!CSSObj.flexWrap) {
    CSSObj.flexWrap = 'wrap';
  }
  if (CSSObj.boxShadow !== 'none') {
    // CSSObj.backgroundColor = CSSObj.backgroundColor || '#fff';
  }
  // console.log(CSSObj);
  Object.keys(CSSObj).forEach((key) => {
    if (CSSObj[key] === 'red') {
      // console.log(CSSObj[key]);
      // debugger;
    }
    if (typeof CSSObj[key] === 'string') {
      if ((+CSSObj[key] || CSSObj[key] === '0') && key !== 'fontWeight') {
        // console.log(key, CSSObj[key]);
        if (['lineHeight', 'flex'].includes(key)) {
          CSSObj[key] = +CSSObj[key];
          return;
        } else {
          CSSObj[key] = CSSObj[key] + 'px';
        }
      }
      CSSObj[key] = CSSObj[key].replace(
        getUnitRegexp('px'),
        createPxReplace({ minPixelValue: 1, unitPrecision: 5 }, 'vw', 375)
      );
      if (
        /^(border)(left|right|top|bottom)?$/i.test(key) &&
        typeof CSSObj[key] === 'string'
      ) {
        const [width, style, color] = CSSObj[key].split(' ');
        CSSObj[`${key}Width`] = ['1px', '1PX'].includes(width) ? 1 : width;
        CSSObj[`${key}Color`] = color;
        CSSObj[`${key}Style`] = style;
      }
      if (['margin', 'padding', 'transform'].includes(key)) {
        const value = CSSObj[key];
        if (value) {
          delete CSSObj[key];
          CSSObj = {
            ...CSSObj,
            ...transformCSS([[key, value]]),
          };
        }
        return;
      }
      //不支持
      // CSSObj[key] = CSSObj[key].replace('EM', 'vw');
      if (['undefined', 'false'].includes(CSSObj[key])) {
        delete CSSObj[key];
        return;
      }
      if (CSSObj[key].includes('translate')) {
        delete CSSObj[key];
      }
      if (['0px', '0PX'].includes(CSSObj[key])) {
        CSSObj[key] = 0;
      }
    }
  });
  if (CSSObj.background) {
    CSSObj.backgroundColor = CSSObj.backgroundColor || CSSObj.background;
    if (CSSObj.background === 'none') {
      CSSObj.backgroundColor = 'none';
    }
    delete CSSObj.background;
  }
  if (CSSObj.fontWeight) {
    CSSObj.fontWeight = CSSObj.fontWeight + '';
  }
  // if (CSSObj.zIndex !== -1) {
  //   CSSObj.elevation = CSSObj.zIndex;
  // }
  delete CSSObj.resize;
  delete CSSObj.outline;
  delete CSSObj.animation;
  if (CSSObj.position === 'sticky') {
    delete CSSObj.position;
  }
  if (CSSObj.height === win.height) {
    CSSObj.height = '100vh';
  }
  CSSObj = transform(CSSObj, {
    'width': win.width,
    'height': win.height - appData.headerHeight - statusBarHeight,
    'orientation': win.width > win.height ? 'landscape' : 'portrait',
    'aspect-ratio': win.width / win.height,
    'type': 'screen',
  });
  if (CSSObj.transform) {
    CSSObj.transform = Object.values(CSSObj.transform);
  }
  return CSSObj;
};
