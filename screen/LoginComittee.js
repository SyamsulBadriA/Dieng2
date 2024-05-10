import React, { useState } from "react";
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
import DropdownComittee from "../components/DropdownComittee";

const LoginComitteeScreen = ({ navigation }) => {
  const [participant, setParticipant] = useState("");
  const [selectedCommittee, setSelectedCommittee] = useState(null);

  const handleSubmit = () => {
    Linking.openURL("https://diengcalderarace.com/register");
  };

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.container}
    >
      <Image
        source={require("../assets/logo-white.png")}
        style={{ width: 300, height: 100 }}
      />
      <Text style={styles.title}>Check Point</Text>
      <DropdownComittee
        styles={styles}
        onSelectCommittee={(value) => {
          setSelectedCommittee(value);
          console.log("Nilai yang dipilih dari dropdown:", value);
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Participant"
        value={participant}
        onChangeText={setParticipant}
        editable={true}
      />

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.buttonSubmit}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonTextSubmit}>Submit</Text>
      </TouchableOpacity>
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
  buttonSubmit: {
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
  buttonTextSubmit: {
    color: "black",
    fontSize: 18,
  },
});

export default LoginComitteeScreen;
