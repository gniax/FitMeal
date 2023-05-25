import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HealthGoals from './src/screens/HealthGoals';
import FoodDatabase from './src/screens/FoodDatabase';
import MealPlanning from './src/screens/MealPlanning';

// Création du Bottom Tab Navigator
const Tab = createBottomTabNavigator();

// Notre main
export default function App() {
  return (
    // Tous les screens de navigation :
    // Trois onglets: HealthGoals - FoodDatabase - MealPlanning
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="HealthGoals" component={HealthGoals} />
        <Tab.Screen name="FoodDatabase" component={FoodDatabase} />
        <Tab.Screen name="MealPlanning" component={MealPlanning} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}