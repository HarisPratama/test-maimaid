/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React from 'react';
import { RouteProp, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import List from './src/screens/List';
import Create from './src/screens/Create';
import FlashMessage from 'react-native-flash-message';

type RootStackParamList = {
  List: undefined;
  Create: { userId: number };
};
const RootStack = createStackNavigator<RootStackParamList>();

type ScreenRouteProp = RouteProp<RootStackParamList, 'Create'>;
type NavigationProps = StackNavigationProp<RootStackParamList>

export type Props = {
  navigation: NavigationProps,
  route: ScreenRouteProp
}

const App = () => {

  return (
    <>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="List" >
          <RootStack.Screen name='List' component={List} />
          <RootStack.Screen name='Create' component={Create} />
        </RootStack.Navigator>
      </NavigationContainer>
      <FlashMessage position='top' />
    </>
  );
};


export default App;
