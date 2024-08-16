import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';  // Import FontAwesome for different icon

const BackButton = ({ color = 'black', size = 24, style = '', onPress }) => {

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} className={style}>
      {/* <FontAwesome name="long-arrow-left" size={size} color={color} />  */}
      <FontAwesome 
        name="sign-out" 
        size={size} 
        color={color} 
        // style={styles.flippedIcon}  // Apply the flip style
      />

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  flippedIcon: {
    transform: [{ scaleX: -1 }],  // Horizontal flip
  },
});

export default BackButton;
