import TestRenderer from 'react-test-renderer';
import View from './index';
import React from 'react';

jest.useFakeTimers();

describe('View', () => {
  it('基本渲染', () => {
    expect(
      TestRenderer.create(
        <View style={{ lineHeight: 1.1, background: 'red' }}>
          <View
            style={{
              fontSize: 14,
              fontWeight: 400,
              color: 'red',
              border: '1px solid #eee',
              borderRadius: '50%',
              lineHeight: '2',
            }}
          >
            <View style={{ width: '2em', lineHeight: 16 }}>233</View>
          </View>
        </View>
      ).toJSON()
    ).toMatchSnapshot();
  });
});
