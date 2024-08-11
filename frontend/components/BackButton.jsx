import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BackButton = ({ color = 'black', size = 24, path = null, style = '' }) => {
  const router = useRouter();

  const handlePress = () => {
    if (path) {
      router.push(path);
    } else {
      router.back();
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} className={style}>
      <Ionicons name="arrow-back" size={size} color={color} />
    </TouchableOpacity>
  );
};

export default BackButton;
