import { reLaunch } from 'remax/one';
import appData from '../../appData';

const fn: typeof reLaunch = (params) => {
  const [url, query] = params.url.split('?');
  appData.navigatorProps.navigation.navigate(url, { query });
  appData.navigatorProps.navigation.reset({
    index: 0,
    routes: [{ name: url }],
  });
  return Promise.resolve();
};

export default fn;
