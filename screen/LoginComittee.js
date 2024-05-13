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
import DropdownComittee from "../components/dropdowncomittee";

const LoginComitteeScreen = ({ navigation }) => {
  const [participant, setParticipant] = useState("");
  const [selectedCommittee, setSelectedCommittee] = useState(null);

  const handleSubmit = () => {
    Linking.openURL("https://diengcalderarace.com/register");
  };

  return (
    <ImageBackground
      source={require("../assets/background 2.png")}
      style={styles.container}
    >
      <Image
        source={require("../assets/logo-white.png")}
        style={{ width: 300, height: 100 }}
      />
      <Text style={styles.title}>Check Point</Text>
      <DropdownComittee
        styles={styles}
        onSelect={(value) => {
          setSelectedCommittee(value);
          console.log("Item yang dipilih:", value);
        }}
      />
      {/* <TextInput
        style={styles.input}
        placeholder="Participant"
        value={participant}
        onChangeText={setSelectedCommittee}
        editable={true}
      /> */}
      <View style={styles.inputContainer}>
        <Text style={styles.prefix}>{selectedCommittee}</Text>
        <TextInput
          placeholder="No Runner"
          keyboardType="number-pad"
          underlineColorAndroid="transparent"
          onChangeText={(mobile_number) => this.setState({ mobile_number })}
        />
      </View>
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
  inputContainer: {
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 15,
    width: "100%",
    marginBottom: 10,
    borderRadius: 10,
  },
  prefix: {
    paddingHorizontal: 10,
    fontWeight: "bold",
    color: "black",
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
