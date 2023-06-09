// Coding Guidelines - Prefixes
// - l pour les variables locales (let)
// - p pour les parametres
// - c pour les constantes
// - v pour les var
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function HealthGoals() {
  const [cAge, setAge] = useState('');
  const [cGender, setGender] = useState('');
  const [cHeight, setHeight] = useState('');
  const [cWeight, setWeight] = useState('');
  const [cActivityLevel, setActivityLevel] = useState('');
  const [cHealthGoal, setHealthGoal] = useState('');
  const [cCaloricIntake, setCaloricIntake] = useState('');
  const [cError, setError] = useState('');
  const [cResetKey, setResetKey] = useState(0);

  const cActivityLevels = {
    'sedentary': 1.2,
    'lightly active': 1.375,
    'moderately active': 1.55,
    'very active': 1.725,
    'super active': 1.9,
  }

  const cHealthGoals = {
    'lose weight': -500,
    'maintain weight': 0,
    'gain weight': 500,
  }

  // calcul des calories - on verifie si le formulaire est valide d'abord
  const calculateCaloricIntake = () => {
    if (!cAge || !cGender || !cHeight || !cWeight || !cActivityLevel || !cHealthGoal) {
      setError('Veuillez remplir tous les champs avant de calculer.');
      return;
    }

    // les calculs
    setError('');
    let lBMR = cGender === 'male'
      ? 88.362 + (13.397 * cWeight) + (4.799 * cHeight) - (5.677 * cAge)
      : 447.593 + (9.247 * cWeight) + (3.098 * cHeight) - (4.330 * cAge);

    let lAdjustedBMR = lBMR * cActivityLevels[cActivityLevel];
    let lFinalCaloricIntake = lAdjustedBMR + cHealthGoals[cHealthGoal];
    setCaloricIntake(Math.round(lFinalCaloricIntake));
  }

  // reset du formulaire
  const resetForm = () => {
    setAge('');
    setGender('');
    setHeight('');
    setWeight('');
    setActivityLevel('');
    setHealthGoal('');
    setCaloricIntake('');
    setError('');
    setResetKey(prevKey => prevKey + 1);
  }

  return (
    <View style={cStyles.container}>
      <Text style={cStyles.inputLabel}>Age</Text>
      <TextInput key={`age-${cResetKey}`} style={cStyles.input} placeholder="Age" placeholderTextColor="#B2B2B2" onChangeText={text => setAge(text)} keyboardType='numeric' />
      <Text style={cStyles.inputLabel}>Sexe</Text>
      <View style={cStyles.picker}>
        <Picker color="#B2B2B2" selectedValue={cGender} onValueChange={setGender} style={cStyles.pickerText} dropdownIconColor="#F8F8F8">
          <Picker.Item color="#B2B2B2" label="Choisir le sexe" value="" />
          <Picker.Item color="#B2B2B2" label="Homme" value="male" />
          <Picker.Item color="#B2B2B2" label="Femme" value="female" />
        </Picker>
      </View>
      <Text style={cStyles.inputLabel}>Taille en cm</Text>
      <TextInput key={`height-${cResetKey}`} style={cStyles.input} placeholderTextColor="#B2B2B2" placeholder="Taille en cm" onChangeText={text => setHeight(text)} keyboardType='numeric' />
      <Text style={cStyles.inputLabel}>Poids en kg</Text>
      <TextInput key={`weight-${cResetKey}`} style={cStyles.input} placeholderTextColor="#B2B2B2" placeholder="Poids en kg" onChangeText={text => setWeight(text)} keyboardType='numeric' />
      <Text style={cStyles.inputLabel}>Niveau d'activité</Text>
      <View style={cStyles.picker}>
        <Picker selectedValue={cActivityLevel} style={cStyles.picker} onValueChange={setActivityLevel} dropdownIconColor="#F8F8F8">
          <Picker.Item color="#B2B2B2" label="Choisir le niveau d'activité" value="" />
          <Picker.Item color="#B2B2B2" label="Sédentaire" value="sedentary" />
          <Picker.Item color="#B2B2B2" label="Légèrement actif" value="lightly active" />
          <Picker.Item color="#B2B2B2" label="Modérément actif" value="moderately active" />
          <Picker.Item color="#B2B2B2" label="Très actif" value="very active" />
          <Picker.Item color="#B2B2B2" label="Super actif" value="super active" />
        </Picker>
      </View>
      <Text style={cStyles.inputLabel}>Objectif de santé</Text>
      <View style={cStyles.picker}>
        <Picker selectedValue={cHealthGoal} style={cStyles.picker} onValueChange={setHealthGoal} dropdownIconColor="#F8F8F8">
          <Picker.Item color="#B2B2B2" label="Choisir l'objectif de santé" value="" />
          <Picker.Item color="#B2B2B2" label="Perdre du poids" value="lose weight" />
          <Picker.Item color="#B2B2B2" label="Maintenir votre poids" value="maintain weight" />
          <Picker.Item color="#B2B2B2" label="Prendre du poids" value="gain weight" />
        </Picker>
      </View>
      <View style={cStyles.buttonContainer}>
        <TouchableOpacity style={cStyles.calculateButton} onPress={calculateCaloricIntake}>
          <Text style={cStyles.buttonText}>Calculer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={cStyles.resetButton} onPress={resetForm}>
          <Text style={cStyles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
      {cError && <Text style={cStyles.error}>{cError}</Text>}
      {cCaloricIntake && <Text style={cStyles.result}>Apport calorique quotidien recommandé :</Text>}
      {cCaloricIntake && <Text style={cStyles.caloricIntake}>{cCaloricIntake} calories</Text>}
    </View>
  );
}

const cStyles = StyleSheet.create({
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#bbb',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    margin: 0,
    marginBottom: 10,
    backgroundColor: '#222',
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  datePickerButtonIcon: {
    fontSize: 20,
    color: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#2D2D2D',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#F8F8F8',
  },
  inputLabel: {
    color: '#F8F8F8',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#F8F8F8',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    color: '#F8F8F8',
  },
  picker: {
    borderColor: '#F8F8F8',
    borderWidth: 1,
    marginBottom: 20,
    marginBottom: 20
  },
  pickerText: {
    color: '#F8F8F8',
  },
  error: {
    color: '#ff6961',
    marginBottom: 10,
  },
  result: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8F8F8',
  },
  caloricIntake: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#58D68D',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  calculateButton: {
    backgroundColor: '#F8A978',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#58D68D',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  picker: {
    height: 50,
    backgroundColor: '#222',
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 5,
    color: '#fff',
    marginBottom: 20
  },
  pickerModal: {
    height: 50,
    width: 100,
    backgroundColor: '#222',
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 5,
    color: '#fff',
  },
});