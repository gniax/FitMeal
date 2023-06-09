// Coding Guidelines - Prefixes
// - l pour les variables locales (let)
// - p pour les parametres
// - c pour les constantes
// - v pour les var
import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, ScrollView } from 'react-native';


export default function Home() {
  return (
    <SafeAreaView style={cStyles.container}>
      <ScrollView style={cStyles.scrollView}>
        <View style={cStyles.logoContainer}>
          <Image source={require('../../assets/logo.png')} style={cStyles.logo} />
        </View>
        <View style={cStyles.content}>
          <Text style={cStyles.title}>Bienvenue sur FitMeal!</Text>
          <Text style={cStyles.description}>
		  	On vous aide à gérer votre plan de repas de manière efficace et pratique.
		  	Vous pouvez rechercher des milliers d'aliments, ajouter vos favoris, et créer un plan de repas qui correspond à votre mode de vie.
		  </Text>
          <Text style={cStyles.subtitle}>Pourquoi FitMeal ?</Text>
          <Text style={cStyles.description}>
		  	Notre application rend la planification des repas facile et amusante. 
			Que vous soyez un débutant en cuisine ou un bodybuilder, FitMeal vous offre les outils dont vous avez besoin.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const cStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D2D2D',
  },
  scrollView: {
    backgroundColor: '#2D2D2D',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 140,
    height: 140,
	borderRadius: 45,
	marginTop: 20
  },
  content: {
    padding: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F8F8F8',
  },
  description: {
    fontSize: 18,
    color: '#B2B2B2',
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8F8F8',
    paddingTop: 30,
  },
});