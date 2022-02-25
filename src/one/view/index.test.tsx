import TestRenderer from 'react-test-renderer';
import View from './index'
import React from 'react';

describe('View', () => {
  it('基本渲染', function() {
    expect(TestRenderer.create(
      <View>233</View>
    ).toJSON()).toMatchSnapshot();
  });
})
