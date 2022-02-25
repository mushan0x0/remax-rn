import React from 'react';

export default ({
  wrap: Wrap,
  children,
  wrapProps: {style, ...wrapProps} = {style: {}},
  need,
}: any) => {
  return need ? (
    <Wrap {...wrapProps} style={style}>
      {children}
    </Wrap>
  ) : (
    children || null
  );
};
