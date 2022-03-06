import appData from '@/appData';

const fn = ({ current, urls }: WechatMiniprogram.PreviewImageOption) => {
  appData.setPreviewImages(urls.map((url) => ({ url })));
  appData.setPreviewImagesCurrent(urls.findIndex((url) => url === current));
  appData.setPreviewImagesVisible(true);
  return Promise.resolve({});
};

export default fn;
