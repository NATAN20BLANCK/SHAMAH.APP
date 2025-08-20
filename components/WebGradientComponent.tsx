import { View } from 'react-native';

function WebGradientComponent({ colors, start, end, style, ...props }) {
  const gradientStyle = {
    ...style,
    backgroundImage: `linear-gradient(${calculateAngle(start, end)}deg, ${colors.join(', ')})`,
  };

  return <View style={gradientStyle} {...props} />;
}

function calculateAngle(start, end) {
  if (!start || !end) return 180; // Default vertical gradient
  
  const x1 = start.x || 0.5;
  const y1 = start.y || 0;
  const x2 = end.x || 0.5;
  const y2 = end.y || 1;

  const angleRad = Math.atan2(y2 - y1, x2 - x1);
  const angleDeg = angleRad * (180 / Math.PI) + 90;
  return angleDeg;
}

export { WebGradientComponent };
