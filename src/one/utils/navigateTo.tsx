import { navigateTo } from 'remax/one';
import appData from '../../appData';

const fn: typeof navigateTo = (params) => {
  const [url, query] = params.url.split('?');
  appData.navigatorProps.navigation.navigate(url, { query });
  return Promise.resolve();
};

export default fn;
