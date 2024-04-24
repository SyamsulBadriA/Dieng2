import React from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "react-native-paper";

export default function ContactSupportItem({ styles, phoneNumber, name }) {
  const handleCall = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleWhatsapp = () => {
    Linking.openURL(`https://wa.me/${phoneNumber}`);
  };

  return (
    <View style={styles.modalContactSupport}>
      <Text style={{ fontSize: 16 }}>{name}</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          width: "35%",
        }}
      >
        <TouchableOpacity activeOpacity={0.8} onPress={handleWhatsapp}>
          <Avatar.Icon
            color="green"
            size={40}
            style={styles.callIcon}
            icon="whatsapp"
          />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} onPress={handleCall}>
          <Avatar.Icon
            color="#10385b"
            size={40}
            style={styles.callIcon}
            icon="phone"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
