// Coding Guidelines - Prefixes
// - l pour les variables locales (let)
// - p pour les parametres
// - c pour les constantes
// - v pour les var
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MealPlanContext } from './context';

export default function MealPlanning() {
  const [cDate, setDate] = useState(moment());
  const [cDayIndex, setDayIndex] = useState(0);
  const { cMealPlan, setMealPlan } = useContext(MealPlanContext);

  const cTraduction = { 
    Breakfast: "Petit Déjeuner",
    Lunch: "Déjeuner",
    Snack: "Collation",
    Dinner: "Dîner"
   };

  const cMealOrder = ["Breakfast", "Lunch", "Snack", "Dinner"]; // l'ordre des repas

  useEffect(() => {
    const loadMealPlan = async () => {
      const cSavedMealPlan = await AsyncStorage.getItem('@mealPlan');
      if (cSavedMealPlan) {
        setMealPlan(JSON.parse(cSavedMealPlan));
      }
    };
    loadMealPlan();
  }, []);

  // enregistrer les donnees des que le meal change
  useEffect(() => {
    const saveMealPlan = async () => {
      await AsyncStorage.setItem('@mealPlan', JSON.stringify(cMealPlan));
    };
    saveMealPlan();
  }, [cMealPlan]);

   // gere le clic du precedent jour
  const handlePrevDay = () => {
    if (cDayIndex > 0) {
      setDayIndex(cDayIndex - 1);
      setDate(cDate.clone().subtract(1, 'days'));
    }
  }

  // gere le clic au prochain jour
  const handleNextDay = () => {
    if (cDayIndex < 7) {
      setDayIndex(cDayIndex + 1);
      setDate(cDate.clone().add(1, 'days'));
    }
  }

  // supprime la nourriture du repas
  const removeFoodFromMeal = (pDay, pMeal, pIndex) => {
    setMealPlan(lPrevPlan => {
      let lUpdatedDay = { ...lPrevPlan[pDay] };
      lUpdatedDay[pMeal] = lUpdatedDay[pMeal].filter((food, index) => index !== pIndex);
      return { ...lPrevPlan, [pDay]: lUpdatedDay };
    });
  }

  const calculateDailyCalories = (pDayPlan) => {
    let lTotalCalories = 0;
    let lTotalGlucides = 0;
    let lTotalLipides = 0;
    let lTotalProteines = 0;

    if (pDayPlan) {
      for (let lMeal in pDayPlan) {
        let lFoods = pDayPlan[lMeal];
        for (let i = 0; i < lFoods.length; i++) {
          lTotalCalories += Number(lFoods[i].foodCalories);
          lTotalGlucides += Number(lFoods[i].foodGlucides);
          lTotalLipides += Number(lFoods[i].foodLipides);
          lTotalProteines += Number(lFoods[i].foodProteines);
        }
      }
    }

    return {
      totalCalories: lTotalCalories.toFixed(1),
      totalGlucides: lTotalGlucides.toFixed(1),
      totalLipides: lTotalLipides.toFixed(1),
      totalProteines: lTotalProteines.toFixed(1),
    };
  }

  return (
    <ScrollView style={cStyles.container}>
      <View style={cStyles.content}>
        <View style={cStyles.navigationButtons}>
          {cDayIndex > 0 && (
            <TouchableOpacity onPress={handlePrevDay} style={cStyles.navButton}>
              <Ionicons name="chevron-back-outline" size={24} color="#fff" />
            </TouchableOpacity>
          )}
          <Text style={cStyles.dateText}>{cDate.format('LL')}</Text>
          {cDayIndex < 7 && (
            <TouchableOpacity onPress={handleNextDay} style={cStyles.navButton}>
              <Ionicons name="chevron-forward-outline" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
        <View style={cStyles.mealPlanContainer}>
          {cMealOrder.map((meal, index) => {
            return (
              <View key={index}>
                <Text style={cStyles.mealName}>{cTraduction[meal]}</Text>
                {cMealPlan && Object.keys(cMealPlan).includes(cDate.format('M/D/YYYY')) && cMealPlan[cDate.format('M/D/YYYY')][meal] ? (
                  cMealPlan[cDate.format('M/D/YYYY')][meal].map((lFood, lFoodIndex) => (
                    <View key={lFoodIndex} style={cStyles.foodContainer}>
                      <Image source={{ uri: lFood.foodImage }} style={cStyles.foodLogo} />
                      <View style={cStyles.foodInfo}>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={cStyles.foodName}>{lFood.foodLabel}</Text>
                        <Text style={cStyles.foodCalories}>Calories: {lFood.foodCalories}</Text>
                        <Text style={cStyles.foodCalories}>Glucides: {lFood.foodGlucides}g</Text>
                        <Text style={cStyles.foodCalories}>Lipides: {lFood.foodLipides}g</Text>
                        <Text style={cStyles.foodCalories}>Protéines: {lFood.foodProteines}g</Text>
                      </View>
                      <TouchableOpacity style={cStyles.deleteButton} onPress={() => removeFoodFromMeal(cDate.format('M/D/YYYY'), meal, lFoodIndex)}>
                        <Ionicons name="trash-outline" size={24} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  // Todo: zone si vide
                  <Text></Text>
                )}
              </View>
            );
          })}
        </View>
        <View style={cStyles.totalContainer}>
          <View style={cStyles.hr} />
          <Text style={cStyles.totalCaloriesText}>Total Calories: {calculateDailyCalories(cMealPlan[cDate.format('M/D/YYYY')]).totalCalories}</Text>
          <Text style={cStyles.totalCaloriesText}>Total Glucides: {calculateDailyCalories(cMealPlan[cDate.format('M/D/YYYY')]).totalGlucides}g</Text>
          <Text style={cStyles.totalCaloriesText}>Total Lipides: {calculateDailyCalories(cMealPlan[cDate.format('M/D/YYYY')]).totalLipides}g</Text>
          <Text style={cStyles.totalCaloriesText}>Total Protéines: {calculateDailyCalories(cMealPlan[cDate.format('M/D/YYYY')]).totalProteines}g</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const cStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D2D2D',
  },
  content: {
    padding: 20,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#555',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  mealPlanContainer: {
    marginBottom: 20,
  },
  mealName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 30,
    marginBottom: 10,
  },
  foodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  foodLogo: {
    width: 45,
    height: 45,
    borderRadius: 30,
  },
  foodInfo: {
    flex: 1,
    marginLeft: 10,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  foodCalories: {
    fontSize: 14,
    color: '#aaa',
  },
  deleteButton: {
    backgroundColor: '#f00',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  totalContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  hr: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    width: '100%',
    marginBottom: 10,
  },
  totalCaloriesText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 10,
  },
  noMealText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#aaa',
  },
});