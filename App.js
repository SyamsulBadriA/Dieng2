import React, { useState } from "react";
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

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <PaperProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={isLoggedIn ? "Welcome" : "Login"}>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Welcome">
              {(props) => (
                <WelcomeScreen
                  {...props}
                  onLogout={handleLogout}
                  options={{ headerShown: false }}
                />
              )}
            </Stack.Screen>
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
      </GestureHandlerRootView>
    </PaperProvider>
  );
};

export default App;
