import React from 'react';
import { Polyline } from 'react-native-maps';

const DottedLine = ({
  startPoint,
  endPoint,
  color = '#000000',
  thickness = 2,
  dashLength = 10,
  dashGap = 10,
}) => {
  return (
    <Polyline
      coordinates={[startPoint, endPoint]}
      strokeColor={color}
      strokeWidth={thickness}
      lineDashPattern={[dashLength, dashGap]}
    />
  );
};

export default DottedLine;
