import { Toast } from '@ant-design/react-native';

export default ({
  icon = 'success',
  title,
  duration,
  mask = false,
}: WechatMiniprogram.ShowToastOption) =>
  new Promise((resolve) => {
    Toast.removeAll();
    if (icon === 'none') {
      Toast.show(title, duration, mask);
      setTimeout(resolve, duration);
    } else {
      (Toast as any)[icon](title, duration, resolve, mask);
    }
  });
