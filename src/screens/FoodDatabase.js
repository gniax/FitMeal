import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, ScrollView, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const APP_ID = "aa4451fe";
const APP_KEY = "7c44ee8d3a20c39dd909bbbc48c97a0e";

export default function FoodDatabase() {
  const [cSearchQuery, setSearchQuery] = useState('');
  const [cFoodData, setFoodData] = useState([]);
  const [cMealType, setMealType] = useState('');
  const [cMealPlan, setMealPlan] = useState({
    "Breakfast": [],
    "Lunch": [],
    "Snack": [],
    "Dinner": [],
  });

  const fetchFoodData = async () => {
    let lResponse = await fetch(`https://api.edamam.com/api/food-database/v2/parser?ingr=${cSearchQuery}&app_id=${APP_ID}&app_key=${APP_KEY}`);
    let lData = await lResponse.json();
    setFoodData(lData.hints); // Prend tous les éléments des suggestions
  }

  const addToMealPlan = (pFoodItem) => {
    setMealPlan(pPrevPlan => {
      return {
        ...pPrevPlan,
        [cMealType]: [...pPrevPlan[cMealType], pFoodItem]
      };
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
    height: 40,
    borderColor: 'gray',
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
    fontSize: 18,
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
    marginTop: 20,
  },
});