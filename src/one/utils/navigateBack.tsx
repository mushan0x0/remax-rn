import { navigateBack } from 'remax/one';
import appData from '@/appData';

const fn: typeof navigateBack = () => {
  appData.navigatorProps.navigation.goBack();
  return Promise.resolve();
};

export default fn;
