import React from 'react';
import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../../screens/WelcomeScreen';
import LoginScreen from '../../screens/LoginScreen';
import HomeScreen from '../../screens/HomeScreen';
import RegisterScreen from '../../screens/RegisterScreen';
import AddFoodScreen from '../../screens/AddFoodScreen';
import { FoodProvider } from '../../contexts/FoodContext';
import ViewFoodScreen from '../../screens/ViewFoodScreen';
import FoodDetailsScreen from '../../screens/FoodDetailsScreens';
import { RequestProvider } from '../../contexts/RequestContext';
import RequestListScreen from '../../screens/RequestListScreen';
import ConfirmationScreen from '../../screens/ConfirmationScreen';

const Stack = createNativeStackNavigator();

const App =() =>{
  return (
    <RequestProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddFood" component={AddFoodScreen} />
          <Stack.Screen name="ViewFood" component={ViewFoodScreen} />
          <Stack.Screen name="FoodDetails" component={FoodDetailsScreen} />
          <Stack.Screen name="Requests" component={RequestListScreen} />
          <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </RequestProvider>
  );
}
export default registerRootComponent(App);
