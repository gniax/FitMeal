import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
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

  const calculateCaloricIntake = () => {
    if (!cAge || !cGender || !cHeight || !cWeight || !cActivityLevel || !cHealthGoal) {
      setError('Veuillez remplir tous les champs avant de calculer.');
      return;
    }

    setError('');
    let lBMR = cGender === 'male'
      ? 88.362 + (13.397 * cWeight) + (4.799 * cHeight) - (5.677 * cAge)
      : 447.593 + (9.247 * cWeight) + (3.098 * cHeight) - (4.330 * cAge);

    let lAdjustedBMR = lBMR * cActivityLevels[cActivityLevel];
    let lFinalCaloricIntake = lAdjustedBMR + cHealthGoals[cHealthGoal];
    setCaloricIntake(Math.round(lFinalCaloricIntake));
  }

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
      <Text style={cStyles.inputLabel}>Age *</Text>
      <TextInput key={`age-${cResetKey}`} style={cStyles.input} placeholder="Age" onChangeText={text => setAge(text)} keyboardType='numeric' />
      <Text style={cStyles.inputLabel}>Sexe *</Text>
      <Picker selectedValue={cGender} onValueChange={setGender}>
        <Picker.Item label="Choisir le sexe" value="" />
        <Picker.Item label="Homme" value="male" />
        <Picker.Item label="Femme" value="female" />
      </Picker>
      <Text style={cStyles.inputLabel}>Taille en cm *</Text>
      <TextInput key={`height-${cResetKey}`} style={cStyles.input} placeholder="Taille en cm" onChangeText={text => setHeight(text)} keyboardType='numeric' />
      <Text style={cStyles.inputLabel}>Poids en kg *</Text>
      <TextInput key={`weight-${cResetKey}`} style={cStyles.input} placeholder="Poids en kg" onChangeText={text => setWeight(text)} keyboardType='numeric' />
      <Text style={cStyles.inputLabel}>Niveau d'activité *</Text>
      <Picker selectedValue={cActivityLevel} onValueChange={setActivityLevel}>
        <Picker.Item label="Choisir le niveau d'activité" value="" />
        <Picker.Item label="Sédentaire" value="sedentary" />
        <Picker.Item label="Légèrement actif" value="lightly active" />
        <Picker.Item label="Modérément actif" value="moderately active" />
        <Picker.Item label="Très actif" value="very active" />
        <Picker.Item label="Super actif" value="super active" />
      </Picker>
      <Text style={cStyles.inputLabel}>Objectif de santé *</Text>
      <Picker selectedValue={cHealthGoal} onValueChange={setHealthGoal}>
        <Picker.Item label="Choisir l'objectif de santé" value="" />
        <Picker.Item label="Perdre du poids" value="lose weight" />
        <Picker.Item label="Maintenir votre poids" value="maintain weight" />
        <Picker.Item label="Prendre du poids" value="gain weight" />
      </Picker>
      <View style={cStyles.buttonContainer}>
        <Button title="Calculate" onPress={calculateCaloricIntake} />
        <Button title="Reset" onPress={resetForm} style={cStyles.resetButton} />
      </View>
      {cError && <Text style={cStyles.error}>{cError}</Text>}
      {cCaloricIntake && <Text style={cStyles.result}>Apport calorique quotidien recommandé :</Text>}
      {cCaloricIntake && <Text style={cStyles.caloricIntake}>{cCaloricIntake} calories</Text>}
    </View>
  );
}

const cStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputLabel: {
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  result: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  caloricIntake: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  resetButton: {
    marginLeft: 10,
  },
});