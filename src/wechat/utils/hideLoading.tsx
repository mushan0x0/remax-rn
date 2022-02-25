import { Toast } from '@ant-design/react-native';

export default ({}: WechatMiniprogram.HideLoadingOption = {} as any) =>
  new Promise((resolve) => {
    resolve(undefined);
    Toast.removeAll();
  });
