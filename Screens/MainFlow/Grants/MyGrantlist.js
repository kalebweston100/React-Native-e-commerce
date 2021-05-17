import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Slider, TextInput, ScrollView, TouchableOpacity, FlatList,
    Image, Dimensions, ImageBackground, ActivityIndicator, AsyncStorage, Button } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { Icon } from 'react-native-elements';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Styles, Header} from '../src/Stylesheets';


const MyGrantlist = ({navigation}) => {

        const [carousel, setCarousel] = useState(null);
        const [token, setToken] = useState(null);
        const [grants, setGrants] = useState(null);
        const [loading, setLoading] = useState(true);
        const [display, setDisplay] = useState(null);

        const loadData = async () => {

            try
            {
                let tokenData = null;

                if (!token)
                {
                    const getToken = await AsyncStorage.getItem('token');
                    setToken(getToken);
                    tokenData = getToken;
                }
                else
                {
                    tokenData = token;
                }

                await fetch('http://trevi-server.us-west-2.elasticbeanstalk.com/display-grants/', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + tokenData
                        }
                      })
                      .then((response) => response.json())
                      .then((json) => {
                          loadImages(json, tokenData);
                      })
                      .catch((error) => console.log(error));
            }
            catch (error)
            {
                console.log(error);
            }
        };

        const loadImages = async (grantData, tokenData) => {
            let displayData = null;

            let imageIndex = 0;

            while (imageIndex < grantData.length)
            {
                let tempGrant = grantData[imageIndex];
                let grant_id = tempGrant.grant_id;
                let imageData = await fetch('http://trevi-server.us-west-2.elasticbeanstalk.com/grant-images/', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + tokenData
                        },
                        body: JSON.stringify({
                            id_value: grant_id
                        })
                      })
                      .then((response) => response.json())
                      .then((json) => {return json.image.toString()})
                      .catch((error) => console.log(error));

                    if (imageData)
                    {
                        tempGrant.image = 'data:image/jpg;base64,' + imageData;
                    }
                    else
                    {
                        tempGrant.image = 'none';
                    }

                    imageIndex += 1;
                }
                setGrants(grantData);
            };

            const displayData = (grantData) => {
                if (grantData.length == 0)
                {
                    return (
                        <View>
                            <Text style={Styles.message}>No Grants Yet</Text>
                        </View>
                    )
                }
                else
                {
                    return (
                        <FlatList
                            data={grantData}
                            keyExtractor={({grant_id}, index) => grant_id.toString()}
                            renderItem={({item}) => (
                                <View style={Styles.grant}>
                                    <Text style={Styles.grantTitle}>{item.title}</Text>
                                    <Text style={Styles.grantText}>{item.description}</Text>
                                    <Text style={Styles.grantText}>Category - {item.category}</Text>
                                    <Text style={Styles.grantText}>Condition - {item.condition}</Text>
                                    <Text style={Styles.grantText}>${item.price}</Text>

                                    <Image
                                    source={{uri: item.image}}
                                    style={Styles.grantImage}/>
                                </View>
                            )}/>
                    )
                }
            }

        useEffect(() => {
            if (grants == null)
            {
                loadData();
            }
            else
            {
                setLoading(false);
            }
        }, [grants])

        return (
            <View style={Styles.mainContainer}>

            <Header>
                <View style={Styles.alignLeft}>
                    <TouchableOpacity onPress={() => navigation.navigate('TrendingSimple')}>
                        <IonIcon name={'chevron-back-outline'} size={35} color={'white'}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles.alignRight} onPress={() => navigation.navigate('Grant1')}>
                        <Icon name={'plus'} type={'font-awesome'} size={35} color={'white'}/>
                    </TouchableOpacity>
                </View>

                <Text style={Styles.headerText}>Your Grantlist</Text>
            </Header>

                <View style={Styles.grantContainer}>
                    {loading ? <ActivityIndicator/> : displayData(grants)}
                </View>

                </View>
            );
    };

export default MyGrantlist;
