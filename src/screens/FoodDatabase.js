import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, ScrollView, StyleSheet } from 'react-native';
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
    setMealPlan(pPrevPlan => {
      const dayKey = cMealDay.toLocaleDateString();
      const updatedMealPlan = {
        ...pPrevPlan,
        [cMealType]: [...pPrevPlan[cMealType], pFoodItem]
      };
      AsyncStorage.setItem('@mealPlan', JSON.stringify(updatedMealPlan));
      return updatedMealPlan;
    });
  }

  return (
    <View style={cStyles.container}>
      <TextInput
        placeholder="Recherchez un aliment"
        value={cSearchQuery}
        onChangeText={setSearchQuery}
        style={cStyles.searchInput}
      />
      <Button title="Recherche" onPress={fetchFoodData} />

      <ScrollView style={cStyles.scrollContainer}>
        {cFoodData.length > 0 ? (
          <Text style={cStyles.titleView}>Recherche</Text>
        ) : (
          <Text style={cStyles.titleView}>Favoris</Text>
        )}

        {cFoodData.length > 0 ? (
          cFoodData.map((foodItem, index) => (
            <View key={index} style={cStyles.foodItem}>
              <Text style={cStyles.foodLabel}>{foodItem.food.label}</Text>
              <Image style={cStyles.foodImage} source={{ uri: foodItem.food.image }} />
              <Text style={cStyles.foodInfo}>Calories: {foodItem.food.nutrients.ENERC_KCAL}</Text>
              {/* Ajoutez plus d'informations nutritionnelles ici si nécessaire */}
              
              <Picker selectedValue={cMealType} onValueChange={setMealType} style={cStyles.picker}>
                <Picker.Item label="Sélectionnez le type de repas" value="" />
                <Picker.Item label="Petit déjeuner" value="Breakfast" />
                <Picker.Item label="Déjeuner" value="Lunch" />
                <Picker.Item label="Collation" value="Snack" />
                <Picker.Item label="Dîner" value="Dinner" />
              </Picker>

              <Button title="Ajouter au plan de repas" onPress={() => addToMealPlan(foodItem)} />
            </View>
          ))
        ) : (
          <Text style={cStyles.noResults}>Aucun résultat trouvé</Text>
        )}
      </ScrollView>
    </View>
  );
}

const cStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#555',
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 20,
  },
  scrollContainer: {
    marginTop: 20,
  },
  foodItem: {
    marginBottom: 20,
  },
  foodLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  foodImage: {
    width: '100%',
    height: 200,
  },
  foodInfo: {
    marginTop: 10,
  },
  picker: {
    marginTop: 10,
  },
  noResults: {
    fontSize: 18,
    color: 'gray',
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