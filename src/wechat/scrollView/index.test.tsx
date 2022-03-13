import TestRenderer from 'react-test-renderer';
import Scroll from './index';
import { View } from '@/one';
import React from 'react';

jest.useFakeTimers();

describe('Scroll', () => {
  it('基本渲染', () => {
    expect(
      TestRenderer.create(
        <Scroll
          style={{ flexWrap: 'no-wrap' }}
          className={{ background: 'red' }}
          scrollX
        >
          <View>233</View>
          <View>233</View>
        </Scroll>
      ).toJSON()
    ).toMatchSnapshot();
  });
});
