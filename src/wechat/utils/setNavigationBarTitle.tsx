import appData from '../../appData';

const fn = ({ title }: WechatMiniprogram.SetNavigationBarTitleOption) => {
  appData.navigatorProps.navigation.setOptions({ title });
  return Promise.resolve();
};

export default fn;
