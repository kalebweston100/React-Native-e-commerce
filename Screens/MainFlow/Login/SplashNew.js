import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Alert,
  ImageBackground,
  ScrollView,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Styles} from '../src/Stylesheets'

const SplashScreen = ({navigation}) => {

    return (

      <View style={Styles.mainContainer}>

        <ImageBackground source={require('../../../Assets/Images/TreviSplash.jpg')} style={Styles.backgroundImage}>
        </ImageBackground>

        <View style={Styles.splashButtonContainer}>

            <TouchableOpacity style={Styles.splashButton} onPress={()=> navigation.navigate('CreateAccount')}>
              <Text style={Styles.splashText}>Create Account</Text>
            </TouchableOpacity>

            <TouchableHighlight style={Styles.splashButton} onPress={()=> navigation.navigate('Login')}>
              <Text style={Styles.splashText}>Log In</Text>
            </TouchableHighlight>

        </View>

      </View>

    );
  }

 export default SplashScreen;
