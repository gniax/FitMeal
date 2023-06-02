import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const APP_ID = "aa4451fe";
const APP_KEY = "7c44ee8d3a20c39dd909bbbc48c97a0e";

export default function FoodDatabase() {
  const [cSearchQuery, setSearchQuery] = useState('');
  const [cFoodData, setFoodData] = useState([]);
  const [cMealType, setMealType] = useState('');
  const [cModalVisible, setModalVisible] = useState(false);
  const [cSelectedFood, setSelectedFood] = useState(null);
  const [cMealPlan, setMealPlan] = useState({
    "Breakfast": [],
    "Lunch": [],
    "Snack": [],
    "Dinner": [],
  });

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
    if (cFavorites.includes(foodItem.food.foodId)) {
      updatedFavorites = cFavorites.filter(item => item !== foodItem.food.foodId);
    } else {
      if (!cFavorites.find(item => item === foodItem.food.foodId)) {
        updatedFavorites = [...cFavorites, foodItem.food.foodId];
      } else {
        updatedFavorites = [...cFavorites];
      }
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

  const confirmAddToMealPlan = () => {
    setMealPlan(pPrevPlan => {
      return {
        ...pPrevPlan,
        [cMealType]: [...pPrevPlan[cMealType], cSelectedFood]
      };
    });
    setModalVisible(false);
  }

  const clearSearch = () => {
    setFoodData([]);
  }

  return (
    <View style={cStyles.container}>
      <TextInput
        placeholder="Recherchez un aliment"
        value={cSearchQuery}
        onChangeText={setSearchQuery}
        style={cStyles.searchInput}
      />
      <View style={cStyles.buttonContainer}>
        <Button title="Recherche" onPress={fetchFoodData} />
        <Button title="Clear" onPress={clearSearch} />
      </View>

      <ScrollView style={cStyles.scrollContainer}>
        {cFoodData.length > 0 ? (
          cFoodData.map((foodItem, index) => (
            <View key={index} style={cStyles.foodContainer}>
              <View style={cStyles.foodItem}>
                <Image style={cStyles.foodImage} source={{ uri: foodItem.food.image }} />
                <View style={cStyles.textContainer}>
                  <Text style={cStyles.foodLabel}>{truncateTitle(foodItem.food.label, 30)}</Text>
                  <Text style={cStyles.foodInfo}>Calories: {round(foodItem.food.nutrients.ENERC_KCAL, 1)}</Text>
                </View>
                <View style={cStyles.textContainer}>
                  <Text style={cStyles.foodInfo}>Glucides: {round(foodItem.food.nutrients.CHOCDF, 1)}g</Text>
                  <Text style={cStyles.foodInfo}>Lipides: {round(foodItem.food.nutrients.FAT, 1)}g</Text>
                  <Text style={cStyles.foodInfo}>Protéines: {round(foodItem.food.nutrients.PROCNT, 1)}g</Text>
                </View>
              </View>

              <View style={cStyles.actionRow}>
                <TouchableOpacity onPress={() => toggleFavorite(foodItem)} style={cStyles.favoriteButton}>
                  <Ionicons name={cFavorites.includes(foodItem.food.foodId) ? "star" : "star-outline"} size={24} color="gold" />
                </TouchableOpacity>
                <Button title="Ajouter au plan de repas" onPress={() => addToMealPlan(foodItem)} style={cStyles.mealPlanButton} />
              </View>
            </View>
          ))
        ) : (
          <Text style={cStyles.noResults}>Aucun résultat trouvé</Text>
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
          <Text style={cStyles.modalText}>Sélectionnez le type de repas</Text>
          <Picker selectedValue={cMealType} onValueChange={setMealType} style={cStyles.picker}>
            <Picker.Item label="Petit déjeuner" value="Breakfast" />
            <Picker.Item label="Déjeuner" value="Lunch" />
            <Picker.Item label="Collation" value="Snack" />
            <Picker.Item label="Dîner" value="Dinner" />
          </Picker>
          <Button title="Confirmer" onPress={confirmAddToMealPlan} />
        </View>
      </Modal>
    </View>
  );
}

const cStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  scrollContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  foodContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  foodLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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
  foodInfo: {
    marginTop: 2,
    fontSize: 14,
    color: '#666',
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
    borderColor: '#ddd',
    borderRadius: 5,
  },
  mealPlanButton: {
    flex: 0.8,
  },
  noResults: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    marginTop: "auto",
    marginBottom: "auto",
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  picker: {
    height: 50,
    width: 200,
    color: 'black',
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});