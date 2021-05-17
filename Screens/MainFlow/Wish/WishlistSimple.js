import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Slider, TextInput, ScrollView, TouchableOpacity,
    FlatList, Image, Dimensions, ImageBackground, AsyncStorage, Button, ActivityIndicator} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { Icon } from 'react-native-elements';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Styles, Header} from '../src/Stylesheets'

const WishlistSimple = ({navigation}) => {

    const [token, setToken] = useState(null);
    const [wishes, setWishes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

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

            await fetch('http://trevi-server.us-west-2.elasticbeanstalk.com/display-wishlist/', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + tokenData
                }
            }).then((response) => response.json())
              .then((json) => setWishes(json))
              .finally(() => setLoading(false))
        }
        catch (error)
        {
            console.log(error);
        }
    }

    const displayData = (wishData) => {
        if (wishData.length == 0)
        {
            return (
                <View>
                    <Text style={Styles.message}>No Wishes Yet</Text>
                </View>
            )
        }
        else
        {
            return (
                <FlatList
                data={wishData}
                keyExtractor={({wish_id}, index) => wish_id.toString()}
                renderItem={({item}) => (
                    <View style={Styles.grant}>
                        <Text style={Styles.grantTitle}>Title - {item.title}</Text>
                        <Text style={Styles.grantText}>Category - {item.category}</Text>
                        <Text style={Styles.grantText}>Condition - {item.condition}</Text>
                        <Text style={Styles.grantText}>Minimum Price - ${item.min_price}</Text>
                        <Text style={Styles.grantText}>Maximum Price - ${item.max_price}</Text>
                    </View>
                )}/>
            )
        }
    }

    useEffect(() => {
        async function run()
        {
            await loadData();
        }
        run();
    }, []);

        return (
            <View style={Styles.mainContainer}>

            <Header>
                <View style={Styles.alignLeft}>
                    <TouchableOpacity onPress={() => navigation.navigate('TrendingSimple')}>
                        <IonIcon name={'chevron-back-outline'} size={35} color={'white'}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles.alignRight} onPress={() => navigation.navigate('PostWish')}>
                        <Icon name={'plus'} type={'font-awesome'} size={35} color={'white'}/>
                    </TouchableOpacity>
                </View>

                <Text style={Styles.headerText}>Your Wishlist</Text>
            </Header>

            <View style={Styles.grantContainer}>
                {loading ? <ActivityIndicator/> : displayData(wishes)}
            </View>

            </View>
        );
};

export default WishlistSimple;
