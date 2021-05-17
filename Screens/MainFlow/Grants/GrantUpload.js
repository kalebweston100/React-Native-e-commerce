import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, AsyncStorage, ActivityIndicator, TouchableOpacity } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import PhotoUpload from 'react-native-photo-upload';
import {Styles, Header} from '../src/Stylesheets'

const GrantUpload = ({navigation, route}) => {

    const [token, setToken] = useState(null);
    const [message, setMessage] = useState('');

    const getToken = async () => {
        try
        {
            if (!token)
            {
                const getToken = await AsyncStorage.getItem('token');
                setToken(getToken);
            }
        }
        catch (error)
        {
            console.log(error);
        }
    };

    const uploadImage = async (data) => {

         await fetch('http://trevi-server.us-west-2.elasticbeanstalk.com/grant-upload/', {
             method: 'POST',
             headers: {
                 Accept: 'application/json',
                 'Content-Type': 'application/json',
                 'Authorization': 'Token ' + token
             },
             body: JSON.stringify({
                 grant_id: route.params.grant_id,
                 image: data
             })
            })
           .then((response) => response.json())
           .then((json) => (json.response == 'valid') ? navigation.navigate('Grantlist') : setMessage('Error uploading'))
           .catch((error) => console.log(error));
    };

    return (
        <View onLayout={() => getToken()} style={{flex: 1}}>

            <Header>
                <View style={Styles.alignLeft}>
                    <TouchableOpacity onPress={() => navigation.navigate('Grant2')}>
                        <IonIcon name={'chevron-back-outline'} size={35} color={'white'}/>
                    </TouchableOpacity>
                </View>
                <Text style={Styles.headerText}>Grant Image</Text>
            </Header>

            <PhotoUpload onPhotoSelect={data => uploadImage(data)}>
                <Text style={Styles.contentTitle}>Choose Image</Text>
            </PhotoUpload>

            <View>
                <Text>{message}</Text>
            </View>

        </View>
    );
};

export default GrantUpload;
