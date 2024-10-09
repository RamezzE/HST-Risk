import React from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { images } from '../constants'; // Import your image constants

const PageWrapper = ({ children }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={images.background}
        style={styles.background}
      />
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative", // Allows content layering
  },
  background: {
    ...StyleSheet.absoluteFillObject, // Makes background fill the whole screen
    zIndex: -1, // Sends background behind everything else
  },
});

export default PageWrapper;
