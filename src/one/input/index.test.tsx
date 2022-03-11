import TestRenderer from 'react-test-renderer';
import Input from './index';
import React from 'react';

jest.useFakeTimers();

describe('Input', () => {
  it('基本渲染', () => {
    expect(
      TestRenderer.create(
        <>
          <Input
            style={{
              backgroundColor: 'red',
              0: {
                height: 50,
              },
              1: {
                width: 100,
              },
            }}
          />
        </>
      ).toJSON()
    ).toMatchSnapshot();
  });
});
