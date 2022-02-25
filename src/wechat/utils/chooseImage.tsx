import ImagePicker from 'react-native-image-crop-picker';
import { ActionSheet } from '@ant-design/react-native';

export default ({ sourceType }: WechatMiniprogram.ChooseImageOption) => {
  return new Promise((resolve, reject) => {
    const select = (buttonIndex: number) => {
      // this.setState({clicked: BUTTONS[buttonIndex]});
      if (buttonIndex !== 2) {
        ImagePicker[buttonIndex === 0 ? 'openCamera' : 'openPicker']({
          multiple: true,
          mediaType: 'photo',
        }).then((images) => {
          if (!(images instanceof Array)) {
            images = [images];
          }
          const result: WechatMiniprogram.ChooseImageSuccessCallbackResult = {
            tempFiles: [],
            tempFilePaths: [],
            errMsg: '',
          };
          for (let item of images) {
            result.tempFilePaths.push(item.path);
            result.tempFiles.push({
              path: item.path,
              type: item.mime,
              size: item.size,
              name: item.filename,
              width: item.width,
              height: item.height,
            } as any);
          }
          resolve(result);
        });
      } else {
        reject();
      }
    };
    if (sourceType?.length === 1) {
      select(sourceType.includes('album') ? 1 : 0);
    } else {
      ActionSheet.showActionSheetWithOptions(
        {
          options: ['拍照', '从相册选择', '取消'],
          cancelButtonIndex: 2,
        },
        select
      );
    }
  });
};
