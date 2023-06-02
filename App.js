import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HealthGoals from './src/screens/HealthGoals';
import FoodDatabase from './src/screens/FoodDatabase';
import MealPlanning from './src/screens/MealPlanning';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Objectifs de Santé') {
              iconName = focused ? 'fitness-outline' : 'fitness-sharp';
            } else if (route.name === 'Food Database') {
              iconName = focused ? 'fast-food-outline' : 'fast-food-sharp';
            } else if (route.name === 'Planificateur de Repas') {
              iconName = focused ? 'calendar-outline' : 'calendar-sharp';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: [
            {
              display: 'flex',
            },
            null,
          ],
        })}
      >
        <Tab.Screen name="Objectifs de Santé" component={HealthGoals} />
        <Tab.Screen name="Food Database" component={FoodDatabase} />
        <Tab.Screen name="Planificateur de Repas" component={MealPlanning} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}