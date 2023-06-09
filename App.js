// Coding Guidelines - Prefixes
// - l pour les variables locales (let)
// - p pour les parametres
// - c pour les constantes
// - v pour les var
import React, { useState, useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HealthGoals from './src/screens/HealthGoals';
import FoodDatabase from './src/screens/FoodDatabase';
import MealPlanning from './src/screens/MealPlanning';
import Home from './src/screens/Home';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MealPlanContext } from './src/screens/context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const cTab = createBottomTabNavigator();
export default function vApp() {
  const [cMealPlan, setMealPlan] = useState({
    "Breakfast": [],
    "Lunch": [],
    "Snack": [],
    "Dinner": [],
  });

  // charge le meal par defaut au demarrage
  useEffect(() => {
    const loadMealPlan = async () => {
      const savedMealPlan = await AsyncStorage.getItem('mealPlan');
      if (savedMealPlan) {
        setMealPlan(JSON.parse(savedMealPlan));
      }
    };
    loadMealPlan();
  }, []);

  return (
    <NavigationContainer>
      {/* contexte du plan de repas - besoin pour partager les data d'une view a une autre */}
      <MealPlanContext.Provider value={{ cMealPlan, setMealPlan }}>
        <cTab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Objectifs de Santé') {
                iconName = focused ? 'fitness-outline' : 'fitness-sharp';
              } else if (route.name === 'Food Database') {
                iconName = focused ? 'fast-food-outline' : 'fast-food-sharp';
              } else if (route.name === 'Planificateur de Repas') {
                iconName = focused ? 'calendar-outline' : 'calendar-sharp';
              } else if (route.name === 'Accueil') {
                iconName = focused ? 'home-outline' : 'home-sharp';
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
          <cTab.Screen name="Accueil" component={Home} />
          <cTab.Screen name="Objectifs de Santé" component={HealthGoals} />
          <cTab.Screen name="Food Database" component={FoodDatabase} />
          <cTab.Screen name="Planificateur de Repas" component={MealPlanning} />
        </cTab.Navigator>
      </MealPlanContext.Provider>
    </NavigationContainer>
  );
}