import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { MoveLeft, MoveRight } from 'lucide-react-native';

interface BigButtonProps {
  cookingMode?: boolean;
  forward?: boolean;
  back?: boolean;
  saveIngredients?: boolean;
  addArticle?: boolean;
  onPress?: () => void;
  disabled?: boolean;
}

export default function BigButton({ cookingMode, forward, back, saveIngredients, addArticle, onPress, disabled }: BigButtonProps) {
  const getButtonStyle = (extraStyle = {}) => [
    styles.button,
    extraStyle,
    disabled ? { opacity: 0.5 } : {},
  ];
  const handlePress = disabled ? undefined : onPress;
  return (
    <>
      {cookingMode && (
        <TouchableOpacity style={getButtonStyle({ width: '100%' })} onPress={handlePress} activeOpacity={0.8} disabled={disabled}>
          <Image className="h-[16px]" source={require('../assets/icons/cook.png')} />
          <Text style={styles.textH2}>Kochmodus </Text>
        </TouchableOpacity>
      )}

      {forward && (
        <TouchableOpacity style={getButtonStyle({ flex: 1 })} onPress={handlePress} activeOpacity={0.8} disabled={disabled}>
          <MoveRight size={'100%'} color="white" />
        </TouchableOpacity>
      )}

      {back && (
        <TouchableOpacity style={getButtonStyle({ flex: 1 })} onPress={handlePress} activeOpacity={0.8} disabled={disabled}>
          <MoveLeft size={'100%'} color="white" />
        </TouchableOpacity>
      )}

      {saveIngredients && (
        <TouchableOpacity style={getButtonStyle({ width: '100%' })} onPress={handlePress} activeOpacity={0.8} disabled={disabled}>
          <Text style={styles.textH2}> Zutaten speichern </Text>
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({

  button: {
    backgroundColor: '#66A182',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    height: 55,
  },

  textH2: {
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontSize: 18,
    fontWeight: 'bold',
  },
});