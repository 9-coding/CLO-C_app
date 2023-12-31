import React from 'react'
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { theme } from './core/theme'
import {
    StartScreen,
    LoginScreen,
    RegisterScreen,
    ResetPasswordScreen,
    Dashboard,
} from './src'
import BottomTabNavigator from './src/BottomTabNavigator';

const Stack = createStackNavigator()

export default function App() {
    return (
        <Provider theme={theme}>
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="StartScreen"
                    screenOptions={{
                        headerShown: false,
                    }}
                >
                    <Stack.Screen name="StartScreen" component={StartScreen} />
                    <Stack.Screen name="LoginScreen" component={LoginScreen} />
                    <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
                    {/* Integrate BottomTabNavigator as a screen */}
                    <Stack.Screen name="Dashboard" component={BottomTabNavigator} />
                    <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    )
}