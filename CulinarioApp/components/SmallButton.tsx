import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Settings, ArrowLeft, ShoppingCart, EllipsisVertical, Plus, Save } from 'lucide-react-native';

interface SmallButtonProps {
  settings?: boolean;
  dots?: boolean;
  back?: boolean;
  plus?: boolean;
  shoppingCart?: boolean;
  save?: boolean;
  onPress?: () => void;
}

export default function SmallButton({ settings, dots, back, plus, shoppingCart, save, onPress }: SmallButtonProps) {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      if (back) {
        navigation.goBack();
      }
      if (settings) {
        navigation.navigate('Settings');
      }
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.button, settings && styles.settingsButton, save && styles.saveButton, plus && styles.plusButton]}>
        {settings && <Settings size={'100%'} color="white"/>}
        {dots && <EllipsisVertical size={'100%'} color="white"/>}
        {back && <ArrowLeft size={'100%'} color="white"/>}
        {plus && <Plus size={'100%'} color="white"/>}
        {shoppingCart && <ShoppingCart size={'100%'} color="white"/>}
        {save && <Save size={'100%'} color="white"/>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({

  button: {
    backgroundColor: '#22222280',
    height: 60,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    padding: 12,
  },

  settingsButton: {
    backgroundColor: '#66A182',
    height: 49,
    width: 49,
  },

  saveButton: {
    backgroundColor: '#66A182',
    height: 49,
    width: 49,
  },

  plusButton: {
    height: 40,
    width: 40,
  },
});