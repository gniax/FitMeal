import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function HealthGoals() {
  const [lAge, setAge] = useState('');
  const [lGender, setGender] = useState('');
  const [lHeight, setHeight] = useState('');
  const [lWeight, setWeight] = useState('');
  const [lActivityLevel, setActivityLevel] = useState('');
  const [lHealthGoal, setHealthGoal] = useState('');
  const [lCaloricIntake, setCaloricIntake] = useState('');
  const [lError, setError] = useState('');
  const [resetKey, setResetKey] = useState(0);

  const activityLevels = {
    'sedentary': 1.2,
    'lightly active': 1.375,
    'moderately active': 1.55,
    'very active': 1.725,
    'super active': 1.9,
  }

  const healthGoals = {
    'lose weight': -500,
    'maintain weight': 0,
    'gain weight': 500,
  }

  const calculateCaloricIntake = () => {
    if (!lAge || !lHeight || !lWeight || !lActivityLevel || !lHealthGoal) {
      setError('Veuillez remplir tous les champs avant de calculer.');
      return;
    }

    setError('');
    let lBMR = lGender === 'male'
      ? 88.362 + (13.397 * lWeight) + (4.799 * lHeight) - (5.677 * lAge)
      : 447.593 + (9.247 * lWeight) + (3.098 * lHeight) - (4.330 * lAge);

    let lAdjustedBMR = lBMR * activityLevels[lActivityLevel];
    let lFinalCaloricIntake = lAdjustedBMR + healthGoals[lHealthGoal];
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
    <View style={styles.container}>
      <Text style={styles.title}>FitMeal - Objectifs de Santé</Text>
      <TextInput key={`age-${resetKey}`} style={styles.input} placeholder="Age" onChangeText={text => setAge(text)} keyboardType='numeric' />
      <Picker selectedValue={lGender} onValueChange={setGender}>
        <Picker.Item label="Sexe" value="" />
        <Picker.Item label="Homme" value="male" />
        <Picker.Item label="Femme" value="female" />
      </Picker>
      <TextInput key={`height-${resetKey}`} style={styles.input} placeholder="Taille en cm" onChangeText={text => setHeight(text)} keyboardType='numeric' />
      <TextInput key={`weight-${resetKey}`} style={styles.input} placeholder="Poids en kg" onChangeText={text => setWeight(text)} keyboardType='numeric' />
      <Picker selectedValue={lActivityLevel} onValueChange={setActivityLevel}>
        <Picker.Item label="Niveau d'activité" value="" />
        <Picker.Item label="Sédentaire" value="sedentary" />
        <Picker.Item label="Légèrement actif" value="lightly active" />
        <Picker.Item label="Modérément actif" value="moderately active" />
        <Picker.Item label="Très actif" value="very active" />
        <Picker.Item label="Super actif" value="super active" />
      </Picker>
      <Picker selectedValue={lHealthGoal} onValueChange={setHealthGoal}>
        <Picker.Item label="Objectif de santé" value="" />
        <Picker.Item label="Perdre du poids" value="lose weight" />
        <Picker.Item label="Maintenir votre poids" value="maintain weight" />
        <Picker.Item label="Prendre du poids" value="gain weight" />
      </Picker>
      <View style={styles.buttonContainer}>
        <Button title="Calculate" onPress={calculateCaloricIntake} />
        <Button title="Reset" onPress={resetForm} style={styles.resetButton} />
      </View>
      {lError && <Text style={styles.error}>{lError}</Text>}
      {lCaloricIntake && <Text style={styles.result}>Votre apport calorique quotidien recommandé est de {lCaloricIntake} calories.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
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