import React from 'react';
import { View, StyleSheet } from 'react-native';

const Separator = ({ color = '#e0e0e0', height = 1, marginVertical = 8 }) => {
  return (
    <View
      style={[
        styles.separator,
        {
          backgroundColor: color,
          height: height,
          marginVertical: marginVertical,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  separator: {
    alignSelf: 'stretch', // Ensures the line stretches across its container
  },
});

export default Separator;
