import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Avatar = ({ uri, size = 50, style }) => {
  const imageStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  return <Image source={{ uri }} style={[styles.avatar, imageStyle, style]} />;
};

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#E0E0E0', // A default background color
  },
});

export default Avatar;
