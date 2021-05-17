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
  TouchableOpacity,
  AsyncStorage
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Styles, Header} from '../src/Stylesheets'

const LoginScreen = ({navigation}) => {

    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [message, setMessage] = useState('');

    const loginUser = async () => {
        await fetch('http://trevi-server.us-west-2.elasticbeanstalk.com/login-user/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
            }).then((response) => response.json())
              .then(async (json) => {
                 if (json.response == 'inauthentic')
                 {
                     setMessage('Username or password incorrect');
                 }
                 else if (json.response == 'invalid')
                 {
                     setMessage('Make sure both fields are filled');
                 }
                 else
                 {
                    try
                    {
                        await AsyncStorage.setItem(
                            'token',
                            json.response,
                            () => {navigation.navigate('TrendingSimple')}
                        );
                    }
                    catch (error)
                    {
                        console.log(error);
                    }
                 }
             })
         .catch((error) => console.log(error));
        }

    return (

      <View style={Styles.mainContainer}>

          <Header>
              <View style={Styles.alignLeft}>
                  <TouchableOpacity onPress={() => navigation.navigate('Splash')}>
                      <IonIcon name={'chevron-back-outline'} size={35} color={'white'}/>
                  </TouchableOpacity>
              </View>
              <Text style={Styles.headerText}>Log in</Text>
          </Header>

      <View style={Styles.inputContainer}>

            <View style={Styles.input}>
                <TextInput
                    style={Styles.inputText}
                    placeholder="Username"
                    placeholderTextColor="#D3D3D3"
                    onChangeText={text => setUsername(text)}/>
            </View>

            <View style={Styles.input}>
                <TextInput
                    style={Styles.inputText}
                    placeholder="Password"
                    placeholderTextColor="#D3D3D3"
                    onChangeText={text => setPassword(text)}/>
            </View>

        </View>

            <TouchableOpacity style={Styles.button} onPress={() => loginUser()}>
              <Text style={Styles.buttonText}>Log In</Text>
            </TouchableOpacity>

            <Text>{message}</Text>

      </View>

    );
  }

 export default LoginScreen;
