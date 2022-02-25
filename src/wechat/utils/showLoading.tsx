import { Toast } from '@ant-design/react-native';

export default (
  { title, mask = false }: WechatMiniprogram.ShowLoadingOption = {} as any
) =>
  new Promise((resolve) => {
    resolve(undefined);
    Toast.loading({ content: title, mask });
  });
