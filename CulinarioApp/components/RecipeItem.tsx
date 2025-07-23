import { StyleSheet, Text, TouchableOpacity, View, Image, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../components/navigation/CombinedNavigator';
import { RecipeType } from '../context/RecipeContext';

type RecipeItemNavigationProp = StackNavigationProp<HomeStackParamList, 'Recipe'>;

interface RecipeItemProps {
  recipe?: RecipeType;
}

export default function RecipeItem({ recipe }: RecipeItemProps) {
  const navigation = useNavigation<RecipeItemNavigationProp>();

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

  return (
    <TouchableOpacity 
      className="flex flex-col gap-0 self-start w-full h-[198px] rounded-[15px] overflow-hidden"
      onPress={() => navigation.navigate('Recipe', { recipeId })}
    >

    <View className="w-full h-[149px] bg-white rounded-b-[15px]">
      <ImageBackground
        source={displayImage}
        className="w-full h-full"
        imageStyle={{ borderTopRightRadius: 15, borderTopLeftRadius: 15 }}
      />
    </View>

      <View className="flex items-center justify-center w-full h-[49px] rounded-b-[15px] bg-lightbackground">
        <Text className="text-white text-center text-[16px] font-bold font-[Inter]">
          {displayName}
        </Text>
      </View>
    </TouchableOpacity>
  );
}