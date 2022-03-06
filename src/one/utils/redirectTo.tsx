import { redirectTo } from 'remax/one';
import appData from '@/appData';

const fn: typeof redirectTo = (params) => {
  const [url, query] = params.url.split('?');
  appData.navigatorProps.navigation.replace(url, { query });
  return Promise.resolve();
};

export default fn;
