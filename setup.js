// import { Dimensions } from 'react-native';
import { jest } from '@jest/globals';

// jest.spyOn(Dimensions, 'get').mockReturnValue({ width: 414, height: 818 });
jest.mock('@react-navigation/native', () => ({
  useIsFocused: () => true,
}));
