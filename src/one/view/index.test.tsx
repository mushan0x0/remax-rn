import TestRenderer from 'react-test-renderer';
import View from './index';
import React from 'react';
import { Native } from '@kqinfo/ui';

jest.useFakeTimers();

describe('View', () => {
  it('基本渲染', () => {
    expect(
      TestRenderer.create(
        <Native
          initData={{
            style: { lineHeight: 1.1, background: 'red', margin: '20px 0' },
          }}
        >
          {1}
          <View
            style={{
              fontSize: 14,
              fontWeight: 400,
              color: 'red',
              border: '1px solid #eee',
              borderRadius: '50%',
              lineHeight: '2',
              height: '100vh',
              padding: '20px 0',
            }}
          >
            <View
              style={{
                width: '2em',
                lineHeight: 16,
                backgroundColor: 'red',
                background: 'none',
              }}
            >
              233
            </View>
            <View style={{ width: '2em', lineHeight: 1 }}>233</View>
          </View>
        </Native>
      ).toJSON()
    ).toMatchSnapshot();
  });
});
