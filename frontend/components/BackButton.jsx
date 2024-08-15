import React from 'react';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';  // Import FontAwesome for different icon

const BackButton = ({ color = 'black', size = 24, style = '', onPress }) => {

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} className={style}>
      <FontAwesome name="long-arrow-left" size={size} color={color} /> 
    </TouchableOpacity>
  );
};

export default BackButton;
