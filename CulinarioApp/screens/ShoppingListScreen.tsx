import React, { useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { Text, TouchableOpacity, View, ScrollView, StyleSheet } from 'react-native';
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "../components/navigation/StackNavigator";

import { Searchbar } from 'react-native-paper';

// Imports Compponents
import SmallButton from '../components/SmallButton';
import CategoryItem from '../components/CategoryItem';
import RecipeItem from '../components/RecipeItem';

export default function ShoppingListScreen() {

    return (
        <View className="flex-1 h-full flex-col gap-6 bg-darkbackground p-6 pt-[68px]">
            <StatusBar style="light" />


            {/* Recipe List */}
            <ScrollView style={{ flex: 1, flexGrow: 1 }} contentContainerStyle={{ flexDirection: 'column', gap: 24, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
                <RecipeItem />
                <RecipeItem />
                <RecipeItem />
                <RecipeItem />
                <RecipeItem />
            </ScrollView>
        </View>
    );
}