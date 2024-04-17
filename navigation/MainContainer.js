import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// TELAS
import HomeScreen from './screens/HomeScreen'
import DetailsScreen from './screens/DetailsScreen'
import SettingsScreen from './screens/SettingsScreen'
import EditProd from './screens/EditProd'

//NOMES TELAS
const homeName = 'Home';
const detailsName = 'Leitor';
const settingsName = 'Produtos';
const Edit = 'Editar/Inserir  Produto';

const Tab = createBottomTabNavigator();

export default function MainContainer(){
    return (
         <NavigationContainer>
            <Tab.Navigator 
            initialRouteName={homeName}
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {

                    let iconName;
                    let rn = route.name;

                    if(rn === homeName){
                        iconName = focused? 'home' : 'home-outline';
                    }else if (rn === detailsName){
                        iconName = focused? 'qr-code' : 'qr-code-outline';
                    }else if(rn ===settingsName){
                        iconName = focused? 'settings' : 'settings-outline';
                    }else if(rn === 'EditProd'){
                        iconName = focused ? 'pencil' : 'pencil-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color}/>

                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'grey',
                tabBarLabelStyle: {
                    paddingBottom: 10,
                    fontSize: 10
                },
                tabBarStyle: {
                    display: "flex"
                }
            })}           
            
            >                

                <Tab.Screen name = {homeName} component={HomeScreen}/>
                <Tab.Screen name = {detailsName} component={DetailsScreen}/>
                <Tab.Screen name = {settingsName} component={SettingsScreen}/>
                <Tab.Screen name="EditProd" component={EditProd} />
            </Tab.Navigator>
         </NavigationContainer>
    );
}