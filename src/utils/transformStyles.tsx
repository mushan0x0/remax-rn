import { CSSProperties } from 'react';
import { Dimensions, StatusBar } from 'react-native';
// @ts-ignore
import { transform } from 'css-viewport-units-transform';
import appData from '../appData';
// @ts-ignore
import { getUnitRegexp, createPxReplace } from './pxToVw';

type Styles = { [key: string]: CSSProperties };

const win = Dimensions.get('window');

export default (
  { ...styles }: Styles = {},
  ...arg: (string | false | { [key: string]: boolean } | undefined)[]
) => {
  const CSSObj: any =
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
      if (['margin', 'padding'].includes(key) && CSSObj[key]?.includes(' ')) {
        const [top, right, bottom, left = right] = CSSObj[key].split(' ');
        delete CSSObj[key];
        CSSObj[`${key}top`] = top;
        CSSObj[`${key}right`] = right;
        CSSObj[`${key}bottom`] = bottom;
        CSSObj[`${key}left`] = left;
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
  if (CSSObj.padding !== undefined) {
    const { padding } = CSSObj;
    CSSObj.paddingTop = padding;
    CSSObj.paddingBottom = padding;
    CSSObj.paddingLeft = padding;
    CSSObj.paddingRight = padding;
  }
  if (CSSObj.background === 'none') {
    CSSObj.backgroundColor = 'none';
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
  // if (CSSObj.display === 'flex') {
  //   CSSObj.width = '100%';
  // }
  // console.log(JSON.stringify(CSSObj));
  return transform(CSSObj, {
    'width': win.width,
    'height':
      win.height - appData.headerHeight - (StatusBar.currentHeight || 0),
    'orientation': win.width > win.height ? 'landscape' : 'portrait',
    'aspect-ratio': win.width / win.height,
    'type': 'screen',
  });
};
