import React, { useContext, useState } from 'react';
import { View, Text, Image, TextInput, Button, FlatList, StyleSheet } from 'react-native';
// import { IngredientContext } from '../context/IngredientContext';
import SmallButton from '../components/SmallButton';

const SettingsScreen = () => {
    // const { ingredients, addIngredient } = useContext(IngredientContext);
    const [name, setName] = useState('');
    const [image, setImage] = useState('');

    return (
        <View>
            {/* Top Bar */}
            <View style={styles.topBar}>
                <SmallButton back={true} />
                <SmallButton shoppingCart={true} />
            </View>

            <Text>Zutatenliste:</Text>
            {/* <FlatList
                data={ingredients}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View>
                        <Image source={{ uri: item.image }} style={{ width: 50, height: 50 }} />
                        <Text>{item.name}</Text>
                    </View>
                )}
            /> */}

            <Text>Neue Zutat hinzufügen:</Text>
            <TextInput placeholder="Name" value={name} onChangeText={setName} />
            <TextInput placeholder="Bild-URL" value={image} onChangeText={setImage} />
            {/* <Button title="Hinzufügen" onPress={() => addIngredient({ name, image })} /> */}
        </View>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
  },

  scrollContainer: {
    paddingBottom: 60,
    backgroundColor: '#161616',
  },

  imageContainer: {
    width: '100%',
    height: 360,
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 68,
  },

  recipeContainer: {
    flex: 1,
    gap: 24,
    padding: 24,
    backgroundColor: '#161616',
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginTop: -15,
  },

  infoCointainer: {
    backgroundColor: '#222222',
    flexDirection: 'row',
    gap: 24,
    justifyContent: 'center',
    padding: 12,
    borderRadius: 15,
  },

  amountCounter: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },

  amountCounterButton: {
    backgroundColor: '#222222',
    borderRadius: 5,
    height: 27.5,
    width: 27.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ingredientList: {
    flexDirection: 'column',
    gap: 12,
  },

  horizontalDivider: {
    backgroundColor: '#66A182',
    height: 1,
  },

  verticalDivider: {
    backgroundColor: '#66A182',
    width: 1,
    height: 30,
  },

  textH1: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat',
    fontSize: 24,
    fontWeight: 'bold',
  },

  textH2: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat',
    fontSize: 18,
    fontWeight: 'bold',
  },

  fixedButtonContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 24,
  },
});