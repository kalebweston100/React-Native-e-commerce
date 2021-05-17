import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, AsyncStorage, ActivityIndicator } from 'react-native';
import { MainWrapper, HeaderPrimary, BackIcon, LogoMain, MainWrapperPrimary, Wrapper, SmallTitle, TinyTitle, SmallText, Spacer, ImageRound, TitleInfoCard } from '../../../Components';
import { CardWrapper, AbsoluteWrapper } from '../../../Components/wrappers';
import { Colors, AppStyles, Sizes, appImages } from '../../../Themes';
import { totalSize } from 'react-native-dimension';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PhotoUpload from 'react-native-photo-upload';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Styles, Header} from '../src/Stylesheets'

const Profile = ({navigation}) => {

    const [token, setToken] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [bio, setBio] = useState('');
    const [message, setMessage] = useState('');

    const displayData = async () => {
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

            await fetch('http://trevi-server.us-west-2.elasticbeanstalk.com/display-account/', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + tokenData
                }
            }).then((response) => response.json())
              .then((json) => {
                  setFirstName(json.first_name);
                  setLastName(json.last_name);
                  setBio(json.bio);
              })
        }
        catch (error)
        {
            console.log(error);
        }
    }

        useEffect(() => {
            displayData();
            retrieveImage();
            }, [true]);

        const uploadImage = async (data) => {
            await fetch('http://trevi-server.us-west-2.elasticbeanstalk.com/account-upload/', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + token
                },
                body: JSON.stringify({
                    image: data
                })
                })
              .then((response) => response.json())
              .then((json) => (json.response == 'valid') ? setMessage('Photo uploaded') : setMessage('Error uploading'))
              .finally(() => retrieveImage())
          }

          const [image, setImage] = useState(null);
          const [imageLoading, setImageLoading] = useState(true);

          const retrieveImage = async () => {
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

                  let imageUri = null;

              await fetch('http://trevi-server.us-west-2.elasticbeanstalk.com/account-images/', {
                  method: 'POST',
                  headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                      'Authorization': 'Token ' + tokenData
                  },
                  })
                .then((response) => response.json())
                .then((json) => {
                    if (json.image == 'none')
                    {
                        setImage('../../../Assets/Images/littleTreviLogo.png');
                        console.log('no image');
                    }
                    else
                    {
                        let imageData = json.image.toString();
                        imageUri = 'data:image/jpg;base64,' + imageData;
                        setImage(imageUri);
                    }
                })
                .finally(() => setImageLoading(false))
            }
            catch (error)
            {
                console.log(error);
            }
        }


        return (
            <View style={Styles.mainContainer}>

            <Header>
                <View style={Styles.alignLeft}>
                    <TouchableOpacity onPress={() => navigation.navigate('TrendingSimple')}>
                        <IonIcon name={'chevron-back-outline'} size={35} color={'white'}/>
                    </TouchableOpacity>
                </View>

                    <Text style={Styles.headerText}>Profile</Text>
            </Header>

                <View>
                    <Text style={Styles.contentTitle}>{firstName} {lastName}</Text>
                    <Text style={Styles.contentText}>{bio}</Text>
                </View>

                {imageLoading ? <ActivityIndicator/> : (

                    <Image
                    source={{uri: image}}
                    style={Styles.profileImage}/>
                )}

                <PhotoUpload onPhotoSelect={data => uploadImage(data)}>
                    <TouchableOpacity style={Styles.splashButton}>
                        <Text style={Styles.splashText}>Upload Image</Text>
                    </TouchableOpacity>
                </PhotoUpload>


            </View>
        );
    }

export default Profile;
