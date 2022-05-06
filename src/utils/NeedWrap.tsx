import React from 'react';

export default React.forwardRef(
  (
    {
      wrap: Wrap,
      children,
      wrapProps: { style, ...wrapProps } = { style: {} },
      need,
    }: any,
    ref
  ) => {
    return need ? (
      <Wrap {...wrapProps} ref={ref} style={style}>
        {children}
      </Wrap>
    ) : (
      children || null
    );
  }
);
