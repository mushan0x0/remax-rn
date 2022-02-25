import GetLocation from 'react-native-get-location';
import gcoord from 'gcoord';

const fn = () =>
  GetLocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 15000
  }).then(result => {
    const [longitude, latitude] = gcoord.transform(
      [result.longitude, result.latitude],
      gcoord.WGS84,
      gcoord.GCJ02
    );
    result.latitude = latitude;
    result.longitude = longitude;
    return result;
  });

export default fn;
