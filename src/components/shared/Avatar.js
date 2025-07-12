import React from 'react';
import { Image } from 'react-native';

const Avatar = ({ uri, style }) => {
  return <Image source={{ uri }} style={style} />;
};

export default Avatar;
