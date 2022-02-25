import { DatePicker, Picker } from '@ant-design/react-native';
import React from 'react';
import dayjs from 'dayjs';

export default ({ mode, value, range, ...props }: any) => {
  // eslint-disable-next-line no-shadow
  const handleChange = (value: any) => {
    props?.onChange?.({ detail: { value } });
  };
  if (mode === 'date') {
    return (
      <DatePicker
        minDate={new Date(dayjs('1900-01-01', 'YYYY-MM-DD').toISOString())}
        maxDate={new Date(dayjs('2100-01-01', 'YYYY-MM-DD').toISOString())}
        value={new Date(dayjs(value).format('YYYY-MM-DD').toString())}
        mode={'date'}
        data={range}
        {...props}
        // eslint-disable-next-line no-shadow
        onChange={(value) =>
          handleChange(value && dayjs(value).format('YYYY-MM-DD'))
        }
      />
    );
  }
  return (
    <Picker
      cols={range?.length}
      data={range}
      value={value?.map((v: any, i: any) => range[i]?.[v]?.value)}
      {...props}
      onChange={(v) => {
        handleChange(
          // eslint-disable-next-line no-shadow
          v?.map((v, i) => range[i].findIndex(({ value }: any) => value === v))
        );
      }}
    />
  );
};
