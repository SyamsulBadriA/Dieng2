import React, { useState, createContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "./screen/Welcome";
import LoginScreen from "./screen/Login";
import Screen10km from "./screen/10km";
import Screen20km from "./screen/20km";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";

const Stack = createStackNavigator();

export const UserContext = createContext(null);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleLogin = (user, photo) => {
    setUserData({ user, photo });
    setIsLoggedIn(true);
  };

  return (
    <PaperProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <UserContext.Provider value={{ userData, handleLogin }}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName={isLoggedIn ? "Welcome" : "Login"}>
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Welcome"
                component={WelcomeScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="10km"
                component={Screen10km}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="20km"
                component={Screen20km}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </UserContext.Provider>
      </GestureHandlerRootView>
    </PaperProvider>
  );
};

export default App;
