import React, { useContext, useState } from 'react';
import { View, Text, Image, TextInput, Button, FlatList } from 'react-native';
import { IngredientContext } from '../context/IngredientContext';

const IngredientScreen = () => {
  const { ingredients, addIngredient } = useContext(IngredientContext);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');

  return (
    <View>
      <Text>Zutatenliste:</Text>
      <FlatList
        data={ingredients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Image source={{ uri: item.image }} style={{ width: 50, height: 50 }} />
            <Text>{item.name}</Text>
          </View>
        )}
      />

      <Text>Neue Zutat hinzufügen:</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} />
      <TextInput placeholder="Bild-URL" value={image} onChangeText={setImage} />
      <Button title="Hinzufügen" onPress={() => addIngredient({ name, image })} />
    </View>
  );
};

export default IngredientScreen;