// Coding Guidelines - Prefixes
// - l pour les variables locales (let)
// - p pour les parametres
// - c pour les constantes
// - v pour les var
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Image, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DatePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { MealPlanContext } from './context';

const APP_ID = "aa4451fe";
const APP_KEY = "7c44ee8d3a20c39dd909bbbc48c97a0e";

export default function FoodDatabase() {
  const { cMealPlan, setMealPlan } = useContext(MealPlanContext);
  const [cSearchQuery, setSearchQuery] = useState('');
  const [cFoodData, setFoodData] = useState([]);
  const [cMealType, setMealType] = useState('Breakfast');
  const [cModalVisible, setModalVisible] = useState(false);
  const [cSelectedFood, setSelectedFood] = useState(null);
  const [cMealDay, setMealDay] = useState(new Date());
  const [cShowDatePicker, setShowDatePicker] = useState(false);

  const [cFavorites, setFavorites] = useState([]);

  useEffect(() => {
    getFavorites();
  }, []);

  const getFavorites = async () => {
    try {
      const value = await AsyncStorage.getItem('@favorites')
      if (value !== null) {
        setFavorites(JSON.parse(value));
      }
    } catch (e) {
      console.error(e);
    }
  }

  const toggleFavorite = async (foodItem) => {
    let updatedFavorites;
    if (foodItem && foodItem.food && cFavorites.some(item => item.food.foodId === foodItem.food.foodId)) {
      updatedFavorites = cFavorites.filter(item => item.food.foodId !== foodItem.food.foodId);
    } else {
      updatedFavorites = [...cFavorites, foodItem];
    }
    setFavorites(updatedFavorites);
    await AsyncStorage.setItem('@favorites', JSON.stringify(updatedFavorites));
  }

  const fetchFoodData = async () => {
    let lResponse = await fetch(`https://api.edamam.com/api/food-database/v2/parser?ingr=${cSearchQuery}&app_id=${APP_ID}&app_key=${APP_KEY}`);
    let lData = await lResponse.json();
    let filteredData = lData.hints.filter((foodItem, index, self) =>
      index === self.findIndex((t) => (
        t.food.label === foodItem.food.label &&
        t.food.nutrients.ENERC_KCAL === foodItem.food.nutrients.ENERC_KCAL
      ))
    )
    setFoodData(filteredData);
  }

  const addToMealPlan = (pFoodItem) => {
    setSelectedFood(pFoodItem);
    setModalVisible(true);
  }

  const truncateTitle = (title, maxLength) => {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + '...';
    } else {
      return title;
    }
  }

  const round = (value, precision) => {
    let multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || cMealDay;
    setShowDatePicker(false);
    setMealDay(currentDate);
  };

  const confirmAddToMealPlan = async () => {
    setMealPlan(pPrevPlan => {
      const dayKey = cMealDay.toLocaleDateString();
      const updatedMealPlan = {
        ...pPrevPlan,
        [dayKey]: {
          ...pPrevPlan[dayKey],
          [cMealType]: [...(pPrevPlan[dayKey]?.[cMealType] || []),
          {
            foodLabel: cSelectedFood.food.label,
            foodImage: cSelectedFood.food.image,
            foodCalories: round(cSelectedFood.food.nutrients.ENERC_KCAL, 1),
            foodGlucides: round(cSelectedFood.food.nutrients.CHOCDF, 1),
            foodLipides: round(cSelectedFood.food.nutrients.FAT, 1),
            foodProteines: round(cSelectedFood.food.nutrients.PROCNT, 1),
          }]
        }
      };
      AsyncStorage.setItem('@mealPlan', JSON.stringify(updatedMealPlan));
      return updatedMealPlan;
    });
    setModalVisible(false);
  }

  // chargement des donnes de meal plan au debut
  useEffect(() => {
    const loadMealPlan = async () => {
      const savedMealPlan = await AsyncStorage.getItem('@mealPlan');
      if (savedMealPlan) {
        setMealPlan(JSON.parse(savedMealPlan));
      }
    };
    loadMealPlan();
  }, []);


  // clear de la recherche
  const clearSearch = () => {
    setFoodData([]);
  }

  return (
    <View style={cStyles.container}>
      <View style={cStyles.searchContainer}>
        <TextInput
          placeholderTextColor="#eee"
          placeholder="Recherchez un aliment"
          value={cSearchQuery}
          onChangeText={setSearchQuery}
          style={cStyles.searchInput}
        />
        <TouchableOpacity style={cStyles.searchButton} onPress={fetchFoodData}>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={cStyles.buttonContainer}>
        <TouchableOpacity style={cStyles.defaultButton} onPress={clearSearch}>
          <Ionicons name="star" size={24} color="gold" />
        </TouchableOpacity>
      </View>

      <ScrollView style={cStyles.scrollContainer}>
        {cFoodData.length > 0 ? (
          <Text style={cStyles.titleView}>Recherche</Text>
        ) : (
          <Text style={cStyles.titleView}>Favoris</Text>
        )}

        {cFoodData.length > 0 ? (
          cFoodData.map((foodItem, index) => (
            <View key={index} style={cStyles.foodContainer}>
              <View style={cStyles.foodItem}>
                {foodItem.food.image && (
                  <Image style={cStyles.foodImage} source={{ uri: foodItem.food.image }} />
                )}
                <View style={cStyles.textContainer}>
                  <Text style={cStyles.foodLabel}>{truncateTitle(foodItem.food.label, 30)}</Text>
                  {foodItem.food.nutrients.ENERC_KCAL && (
                    <Text style={cStyles.foodInfo}>Calories: {round(foodItem.food.nutrients.ENERC_KCAL, 1)}</Text>
                  )}
                </View>
                <View style={cStyles.textContainer}>
                  <Text style={cStyles.foodInfo}>Glucides: {round(foodItem.food.nutrients.CHOCDF, 1)}g</Text>
                  <Text style={cStyles.foodInfo}>Lipides: {round(foodItem.food.nutrients.FAT, 1)}g</Text>
                  <Text style={cStyles.foodInfo}>Protéines: {round(foodItem.food.nutrients.PROCNT, 1)}g</Text>
                </View>
              </View>

              <View style={cStyles.actionRow}>
                <TouchableOpacity onPress={() => toggleFavorite(foodItem)} style={cStyles.favoriteButton}>
                  <Ionicons name={cFavorites.some(item => item.food.foodId === foodItem.food.foodId) ? "star" : "star-outline"} size={24} color="gold" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => addToMealPlan(foodItem)} style={cStyles.mealPlanButton}>
                  <Text style={cStyles.buttonText}>Ajouter au plan de repas</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : cFavorites.length > 0 ? (
          cFavorites.map((favoriteFoodItem, index) => {
            return (
              <View key={index} style={cStyles.foodContainer}>
                <View style={cStyles.foodItem}>
                  <Image style={cStyles.foodImage} source={{ uri: favoriteFoodItem.food.image }} />
                  <View style={cStyles.textContainer}>
                    <Text style={cStyles.foodLabel}>{truncateTitle(favoriteFoodItem.food.label, 30)}</Text>
                    <Text style={cStyles.foodInfo}>Calories: {round(favoriteFoodItem.food.nutrients.ENERC_KCAL, 1)}</Text>
                  </View>
                  <View style={cStyles.textContainer}>
                    <Text style={cStyles.foodInfo}>Glucides: {round(favoriteFoodItem.food.nutrients.CHOCDF, 1)}g</Text>
                    <Text style={cStyles.foodInfo}>Lipides: {round(favoriteFoodItem.food.nutrients.FAT, 1)}g</Text>
                    <Text style={cStyles.foodInfo}>Protéines: {round(favoriteFoodItem.food.nutrients.PROCNT, 1)}g</Text>
                  </View>
                </View>

                <View style={cStyles.actionRow}>
                  <TouchableOpacity onPress={() => toggleFavorite(favoriteFoodItem)} style={cStyles.favoriteButton}>
                    <Ionicons name={cFavorites.some(item => item.food.foodId === favoriteFoodItem.food.foodId) ? "star" : "star-outline"} size={24} color="gold" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => addToMealPlan(favoriteFoodItem)} style={cStyles.mealPlanButton}>
                    <Text style={cStyles.buttonText}>Ajouter au plan de repas</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={cStyles.noResults}>Veuillez ajouter des plats en favori pour un accès rapide</Text>
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={cModalVisible}
        onRequestClose={() => {
          setModalVisible(!cModalVisible);
        }}
      >
        <View style={cStyles.modalView}>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={cStyles.closeButton}>
            <Ionicons name="close-outline" size={24} color="black" />
          </TouchableOpacity>
          <Text style={cStyles.modalText}>Ajouter le repas au plan</Text>
          <Picker selectedValue={cMealType} onValueChange={setMealType} style={cStyles.picker}>
            <Picker.Item label="Petit déjeuner" value="Breakfast" />
            <Picker.Item label="Déjeuner" value="Lunch" />
            <Picker.Item label="Collation" value="Snack" />
            <Picker.Item label="Dîner" value="Dinner" />
          </Picker>

          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <View style={cStyles.datePickerButton}>
              <Text style={cStyles.datePickerText}>Jour du repas: {cMealDay.toLocaleDateString()}</Text>
              <Ionicons style={cStyles.datePickerButtonIcon} name="chevron-down-outline" size={24} color="black" />
            </View>
          </TouchableOpacity>
          {cShowDatePicker && (
            <DatePicker
              value={cMealDay}
              mode={'date'}
              display="default"
              onChange={handleDateChange}
            />
          )}
          <TouchableOpacity onPress={confirmAddToMealPlan} style={cStyles.mealPlanButton}>
            <Text style={cStyles.buttonText}>Confirmer</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const cStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#2D2D2D'
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#555',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 10,
    backgroundColor: '#222',
    color: '#fff',
  },
  searchButton: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 5,
    backgroundColor: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  defaultButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 5,
    backgroundColor: '#333',
  },
  scrollContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  foodContainer: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#222',
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  foodImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  foodLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  foodInfo: {
    marginTop: 2,
    fontSize: 14,
    color: '#aaa',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favoriteButton: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 5,
    backgroundColor: '#333',
  },
  mealPlanButton: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  modalView: {
    position: "relative",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    backgroundColor: "#333",
    borderRadius: 20,
    padding: 20,
    marginTop: "auto",
    marginBottom: "auto",
    maxHeight: 300,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold'
  },
  closeButton: {
    backgroundColor: '#f55',
    borderRadius: 10,
    marginBottom: 10,
    padding: 7,
    elevation: 2,
  },
  modalButton: {
    backgroundColor: '#333',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  buttonTextModal: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#222',
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 5,
    color: '#fff',
    marginBottom: 20
  },  
  titleView: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  noResults: {
    fontSize: 16,
    textAlign: 'center',
    color: '#aaa',
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#bbb',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#333',
  },
  datePickerText: {
    color: '#fff',
    fontSize: 16,
  },
  datePickerButtonIcon: {
    color: '#bbb',
  },
  addMealButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 5,
    backgroundColor: '#333',
  },
});