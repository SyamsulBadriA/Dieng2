import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  Linking,
} from "react-native";
import { BASE_URL } from "../api/api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "This app needs location permission to function properly.",
          [{ text: "OK", onPress: () => {} }]
        );
      }
  
      let storagePermission = await Location.requestForegroundPermissionsAsync();
      if (storagePermission.status !== "granted") {
        Alert.alert(
          "Permission required",
          "This app needs storage permission to function properly.",
          [{ text: "OK", onPress: () => {} }]
        );
      }
    } catch (error) {
      console.error("Error checking permissions:", error);
    }
  };

  const getUserProfile = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/profile/1042`);
      const data = await res.json();
      console.log(data.data);
      return data.data;
    } catch (error) {
      console.error("Kesalahan saat mendapatkan profil:", error);
      return error;
    }
  };

  const handleLogin = async () => {
    try {
      const data = { username: username, password: password };
  
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const resJson = await response.json();
      if (resJson.status == "success") {
        await AsyncStorage.setItem('isLoggedIn', 'true'); 
        const user = await getUserProfile();
        if (user) {
          navigation.navigate("10km", { user });
        }
      } else {
        alert(resJson.message);
      }
    } catch (error) {
      alert("Login failed", error);
    }
  };

  const handleComittee = () => {
    navigation.navigate("LoginComittee");
  };

  const handleRegister = () => {
    Linking.openURL("https://diengcalderarace.com/register");
  };

  const handleForgotPassword = () => {
    Linking.openURL("https://diengcalderarace.com/forget_password");
  };

  return (
    <ImageBackground
      source={require("../assets/background 2.png")}
      style={styles.container}
    >
      {/* <View style={styles.container}> */}
      <Image
        source={require("../assets/logo-white.png")}
        style={{ width: 300, height: 100 }}
      />
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        editable={true}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={true}
      />
      <TouchableOpacity
        style={styles.forgotPassword}
        activeOpacity={0.8}
        onPress={handleForgotPassword}
      >
        <Text style={{ color: "white" }}>Forgot password ?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.button}
        onPress={() => handleLogin()}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.optionalAuth}>Doesn't have an account ?</Text>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.buttonRegister}
        onPress={handleRegister}
      >
        <Text style={styles.buttonTextRegister}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.buttonComittee}
        onPress={handleComittee}
      >
        <Text style={styles.buttonTextRegister}>Login as Committee</Text>
      </TouchableOpacity>
      {/* </View> */}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    paddingTop: 20,
    color: "#fff",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  button: {
    width: "100%",
    backgroundColor: "#1f91c3",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonRegister: {
    width: "100%",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonComittee: {
    width: "100%",
    backgroundColor: "white",
    padding: 15,
    marginTop: 25,
    borderRadius: 10,
    alignItems: "center",
  },
  optionalAuth: {
    color: "white",
    marginVertical: 20,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  buttonTextRegister: {
    color: "black",
    fontSize: 18,
  },
});

export default LoginScreen;
