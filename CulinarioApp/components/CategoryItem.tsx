import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

type CategoryItemProps = {
  category: string;
  isSelected: boolean;
  onPress: () => void;
};

export default function CategoryItem({ category, isSelected, onPress }: CategoryItemProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        className={`flex-row p-[6] pr-[12] rounded-[15] border-primary border gap-3 self-start ${isSelected ? 'bg-primary' : 'bg-darkbackground'}`}
      >
        <Image source={require('../assets/categorycons/vorspeise.png')} />
        <Text className="text-white font-robotoMedium text-base">{category}</Text>
      </View>
    </TouchableOpacity>
  );
}