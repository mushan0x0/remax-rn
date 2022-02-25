import { useQuery } from 'remax';
import { useRoute } from '@react-navigation/native';
import qs from 'querystring';

const useQuery2: typeof useQuery = <Q extends unknown>() => {
  const route = useRoute<any>();
  return qs.parse(route.params?.query || '') as Q;
};

export default useQuery2;
