import React, { Component, useState } from 'react';
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
import {Styles, Header} from '../src/Stylesheets'

const Grant1 = ({navigation}) => {

    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [price, setPrice] = useState(null);
    const [message, setMessage] = useState('');

    const pushData = () => {
        if (title && description && price)
        {
            navigation.navigate('Grant2', {title: title, description: description, price: price});
        }
        else
        {
            setMessage('Please fill all fields');
        }
    }

    return (

      <View style={Styles.mainContainer}>

          <Header>
              <View style={Styles.alignLeft}>
                  <TouchableOpacity onPress={() => navigation.navigate('Grantlist')}>
                      <IonIcon name={'chevron-back-outline'} size={35} color={'white'}/>
                  </TouchableOpacity>
              </View>

                  <Text style={Styles.headerText}>Post Grant</Text>
          </Header>

            <View style={Styles.inputContainer}>
                <View style={Styles.input} >
                <TextInput
                    style={Styles.inputText}
                    placeholder="Item name"
                    placeholderTextColor="#D3D3D3"
                    onChangeText={text => setTitle(text)}/>
                </View>

                <View style={Styles.input}>
                <TextInput
                    style={Styles.inputText}
                    placeholder="Item description"
                    placeholderTextColor="#D3D3D3"
                    onChangeText={text => setDescription(text)}/>
                </View>

                <View style={Styles.input}>
                <TextInput
                    style={Styles.inputText}
                    placeholder="Item price"
                    placeholderTextColor="#D3D3D3"
                    onChangeText={text => setPrice(text)}
                    keyboardType='number-pad'/>
                </View>
            </View>

            <TouchableOpacity style={Styles.button} onPress={() => pushData()}>
                <Text style={Styles.buttonText}>Continue</Text>
            </TouchableOpacity>

            <Text style={Styles.message}>{message}</Text>

      </View>

    );
  }

export default Grant1;
