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
import { Styles, Header } from '../src/Stylesheets';
import IonIcon from 'react-native-vector-icons/Ionicons';

const CreateAccountScreen = ({navigation}) => {

    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [email, setEmail] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [bio, setBio] = useState(null);
    const [message, setMessage] = useState('');

    const createUser = async () => {
        await fetch('http://trevi-server.us-west-2.elasticbeanstalk.com/create-user/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
                email: email,
                first_name: firstName,
                last_name: lastName,
                bio: bio
            })
        })
        .then((response) => response.json())
        .then((json) => {
            if (json.response == 'valid')
            {
                setMessage('Account created');
            }
            else if (json.response == 'taken')
            {
                setMessage('Username is taken');
            }
            else if (json.response == 'invalid')
            {
                setMessage('Error creating account');
            }
        })
        .catch((error) => console.log(error))
      }

    return (

      <View style={Styles.mainContainer}>

        <Header>
            <View style={Styles.alignLeft}>
                <TouchableOpacity onPress={() => navigation.navigate('Splash')}>
                    <IonIcon name={'chevron-back-outline'} size={35} color={'white'}/>
                </TouchableOpacity>
            </View>
            <Text style={Styles.headerText}>Create Account</Text>
        </Header>

        <View style={Styles.inputContainer}>

            <View style={Styles.input}>
            <TextInput
                style={Styles.inputText}
                placeholder="First name"
                placeholderTextColor="#D3D3D3"
                onChangeText={text => setFirstName(text)}/>
            </View>

            <View style={Styles.input}>
            <TextInput
                style={Styles.inputText}
                placeholder="Last name"
                placeholderTextColor="#D3D3D3"
                onChangeText={text => setLastName(text)}/>
            </View>

            <View style={Styles.input}>
            <TextInput
                style={Styles.inputText}
                placeholder="Email"
                placeholderTextColor="#D3D3D3"
                onChangeText={text => setEmail(text)}/>
            </View>

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

        <TouchableOpacity style={Styles.button} onPress={() => createUser()}>
            <Text style={Styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <Text style={Styles.message}>{message}</Text>

      </View>

    );
};

export default CreateAccountScreen;
