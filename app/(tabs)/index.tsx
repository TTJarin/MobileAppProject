import React from 'react';
import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../../screens/WelcomeScreen';
import LoginScreen from '../../screens/LoginScreen';
import RegisterScreen from '../../screens/RegisterScreen';
import HomeScreen from '../../screens/HomeScreen';
import AddFoodScreen from '../../screens/AddFoodScreen';
import ViewFoodScreen from '../../screens/ViewFoodScreen';
import FoodDetailsScreen from '../../screens/FoodDetailsScreens';
import ConfirmationScreen from '../../screens/ConfirmationScreen';
import UserFoodsScreen from '../../screens/UserFoodsScreen';

// If you were using FoodProvider or RequestProvider you could import them here.
// But you confirmed you're not using RequestProvider now.

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddFood" component={AddFoodScreen} />
        <Stack.Screen name="ViewFood" component={ViewFoodScreen} />
        <Stack.Screen name="UserFoods" component={UserFoodsScreen} />
        <Stack.Screen name="FoodDetails" component={FoodDetailsScreen} />
        <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default registerRootComponent(App);
