import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';

interface BigButtonProps {
  cookingMode?: boolean;
  forward?: boolean;
  back?: boolean;
  saveIngredients?: boolean;
  addArticle?: boolean;
  onPress?: () => void;
}

export default function BigButton({ cookingMode, forward, back, saveIngredients, addArticle, onPress }: BigButtonProps) {
  return (
    <>
      {cookingMode && (
        <TouchableOpacity style={[styles.button, { width: '100%' }]} onPress={onPress} activeOpacity={0.8}>
          <Image source={require('../assets/icons/cook.png')} />
          <Text style={styles.textH2}>Kochmodus </Text>
        </TouchableOpacity>
      )}

      {forward && (
        <TouchableOpacity style={[styles.button, { flex: 1 }]} onPress={onPress} activeOpacity={0.8}>
          <Image source={require('../assets/icons/cook.png')} />
        </TouchableOpacity>
      )}

      {saveIngredients && (
        <TouchableOpacity style={[styles.button, { width: '100%' }]} onPress={onPress} activeOpacity={0.8}>
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
  },

  image: {
    width: '100%',
    height: '100%',
  },

  textH2: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat',
    fontSize: 18,
    fontWeight: 'bold',
  },
});