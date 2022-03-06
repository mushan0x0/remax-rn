import { switchTab } from 'remax/one';
import appData from '@/appData';

const fn: typeof switchTab = ({ url }) => {
  appData.tabBarNavigatorProps.navigation.navigate(url);
  return Promise.resolve();
};

export default fn;
