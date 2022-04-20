import { Linking } from 'react-native';

export default async ({ phoneNumber }: any) => {
  Linking.canOpenURL(`tel:${phoneNumber}`).then((supported) => {
    if (!supported) {
      console.log('Can not handle tel:' + phoneNumber);
    } else {
      Linking.openURL(phoneNumber);
    }
  });
};
