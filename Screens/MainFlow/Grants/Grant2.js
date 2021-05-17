import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, Slider, TextInput, ScrollView, TouchableOpacity, Dimensions,ImageBackground,Image, AsyncStorage } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { Icon } from 'react-native-elements';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Styles, Header} from '../src/Stylesheets';

const Grant2 = ({navigation, route}) => {

            const [carousel, setCarousel] = useState(null);
            const [selectedIndex, setIndex] = useState(0);
            const [selectedCategory, setSelectedCategory] = useState('Book');
            const [categories, setCategories] = useState([
                {
                    title: 'Book',
                    iconName: 'book-open-page-variant',
                    iconType: 'material-community',
                },
                {
                    title: 'Car',
                    iconName: 'car-side',
                    iconType: 'material-community',
                },
                {
                    title: 'Tools',
                    iconName: 'toolbox',
                    iconType: 'material-community',
                },
                {
                    title: 'Technology',
                    iconName: 'lightbulb-on',
                    iconType: 'material-community',
                },
                {
                    title: 'Indoor',
                    iconName: 'home',
                    iconType: 'material-community',
                },
                {
                    title: 'All',
                    iconName: 'check-all',
                    iconType: 'material-community',
                },
                {
                    title: 'Clothes',
                    iconName: 'tshirt-crew',
                    iconType: 'material-community',
                },
            ]);

            const [itemCondition, setItemCondition] = useState('Good');
            const [conditions, setConditions] = useState([
                { value: 0, label: 'Poor' },
                { value: 1, label: 'Fair' },
                { value: 2, label: 'Good' },
                { value: 3, label: 'Great' },
                { value: 4, label: 'New' },
            ]);

            const [message, setMessage] = useState('');
            const [token, setToken] = useState(null);
            const [grantId, setGrantId] = useState(null);

            const postGrant = async () => {
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

                    await fetch('http://trevi-server.us-west-2.elasticbeanstalk.com/post-grant/', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': 'Token ' + tokenData
                        },
                        body: JSON.stringify({
                            category: selectedCategory,
                            title: route.params.title,
                            description: route.params.description,
                            price: route.params.price,
                            condition: itemCondition
                        })
                        }).then((response) => response.json())
                          .then((json) => (json.response == 'invalid') ? setMessage('Error posting') : navigation.navigate('GrantUpload', {grant_id: json.response}))
                          .catch((error) => console.log(error));
                }
                catch (error)
                {
                    console.log(error);
                }
            };

    const carouselRender = ({ item, index }) => {
        return (
            <View style={Styles.carouselIcon}>
                <Icon
                    name={item.iconName}
                    type='material-community'
                    color={'white'}
                    //color={index === selectedIndex + 3 ? Colors.orange : Colors.steel}
                    size={40}/>
            </View>
        );
    };

    return (
        <View style={Styles.mainContainer}>

            <Header>
                <View style={Styles.alignLeft}>
                    <TouchableOpacity onPress={() => navigation.navigate('Grant1')}>
                        <IonIcon name={'chevron-back-outline'} size={35} color={'white'}/>
                    </TouchableOpacity>
                </View>
                <Text style={Styles.headerText}>Post Grant</Text>
            </Header>

            <View style={Styles.innerContainer}>

                <Text style={Styles.contentTitle}>Category - {categories[selectedIndex].title}</Text>

                <Carousel
                    ref={(c) => setCarousel(c)}
                    data={categories}
                    loop={true}
                    renderItem={carouselRender}
                    sliderWidth={Dimensions.get('window').width}
                    sliderHeight={50}
                    itemWidth={50}
                    itemHeight={50}
                    onSnapToItem={(index) => {
                        setIndex(index);
                        setSelectedCategory(categories[index].title);
                    }}/>

            <Text style={Styles.contentTitle}>Condition - {itemCondition}</Text>

            <Slider
                style={Styles.slider}
                maximumValue={4}
                step={1}
                value={2}
                thumbTintColor={'#5D41BC'}
                onSlidingComplete={(value) => setItemCondition(conditions[value].label)}/>

            </View>

            <TouchableOpacity style={Styles.button} onPress={() => postGrant()}>
                <Text style={Styles.buttonText}>Continue</Text>
            </TouchableOpacity>

            <Text style={Styles.message}>{message}</Text>

        </View>
    );
}

export default Grant2;
