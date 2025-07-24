import { StyleSheet, Text, TouchableOpacity, View, Image, ImageBackground } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../components/navigation/CombinedNavigator';
import { RecipeType } from '../context/RecipeContext';
import { Trash, Edit } from 'lucide-react-native';

type RecipeItemNavigationProp = StackNavigationProp<HomeStackParamList, 'Recipe'>;


interface RecipeItemProps {
  recipe?: RecipeType;
  onPress?: () => void;
}

import React, { useRef, useState, useContext } from 'react';

import { RecipeContext } from '../context/RecipeContext';

export default function RecipeItem({ recipe, onPress }: RecipeItemProps) {
  const { deleteRecipe } = useContext(RecipeContext);
  const navigation = useNavigation();

  // Fallback für Demo-Daten wenn kein Rezept übergeben wird
  const displayName = recipe?.name || "Marry Me Gnocchi";
  let displayImage;
  //console.log('RecipeItem:', recipe?.image);
  if (recipe?.image) {
    displayImage = { uri: recipe.image };
    //displayImage = require('../assets/recipeImages/marry-me-gnocchi.jpg');
  } else {
    displayImage = require('../assets/recipeImages/marry-me-gnocchi.jpg');
  }
  const recipeId = recipe?.id || '1';

  // State, um zu erkennen, ob geswiped wurde
  const [isSwiped, setIsSwiped] = useState(false);
  const swipeableRef = useRef(null);

  // Render-Funktion für die rechten Buttons beim Swipen
  const renderRightActions = () => (
    <View className="flex flex-col gap-[24px] px-[12px] py-[37px] items-center justify-center h-full w-[64px] border-lightbackground border-r-[4px] border-y-[4px] rounded-r-[15px] bg-darkbackground">
      <TouchableOpacity
        className="w-[40px] h-[40px] items-center justify-center rounded-[15px] bg-lightbackground"
        onPress={() => {
          if (recipe?.id) {
            // @ts-ignore
            navigation.navigate('EditRecipe', { recipeId: recipe.id });
          }
        }}
      >
        <Edit size={14} color="#FFFFFF" />
      </TouchableOpacity>
      
      <TouchableOpacity
        className="w-[40px] h-[40px] items-center justify-center rounded-[15px] bg-lightbackground"
        onPress={async () => {
          if (recipe?.id) {
            await deleteRecipe(recipe.id);
          }
        }}
      >
        <Trash size={14} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      onSwipeableWillOpen={() => setIsSwiped(true)}
      onSwipeableClose={() => setIsSwiped(false)}
    >
      <TouchableOpacity
        className="flex flex-col gap-0 self-start w-full h-[198px] overflow-hidden"
        style={{
          borderTopLeftRadius: 15,
          borderBottomLeftRadius: 15,
          borderTopRightRadius: isSwiped ? 0 : 15,
          borderBottomRightRadius: isSwiped ? 0 : 15,
        }}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View className="w-full h-[149px] bg-white" style={{
          borderTopLeftRadius: 15,
          borderTopRightRadius: isSwiped ? 0 : 15,
        }}>
          <ImageBackground
            source={displayImage}
            className="w-full h-full"
            imageStyle={{ borderTopRightRadius: isSwiped ? 0 : 15, borderTopLeftRadius: 15 }}
          />
        </View>
        <View className="flex items-center justify-center w-full h-[49px] bg-lightbackground" style={{
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: isSwiped ? 0 : 15,
        }}>
          <Text className="text-white text-center text-[16px] font-bold font-robotoMedium">
            {displayName}
          </Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}