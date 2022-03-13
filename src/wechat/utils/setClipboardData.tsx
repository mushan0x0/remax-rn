import Clipboard from '@react-native-clipboard/clipboard';

export default ({ data }: any) => {
  Clipboard.setString(data);
  return Promise.resolve();
};
