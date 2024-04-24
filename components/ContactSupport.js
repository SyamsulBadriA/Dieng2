import React from "react";
import { Text } from "react-native";
import { Modal, Portal } from "react-native-paper";
import ContactSupportItem from "./ContactSupportItem";

const ContactSupport = ({ showModal, visible, styles }) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={showModal}
        contentContainerStyle={{
          width: "85%",
          alignSelf: "center",
          backgroundColor: "white",
          borderRadius: 20,
          padding: 20,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
          Contact Support
        </Text>
        <ContactSupportItem
          styles={styles}
          name="Lovelyo Yeremia"
          phoneNumber="+6285813501033"
        />
        <ContactSupportItem
          styles={styles}
          name="Syamsul Badri"
          phoneNumber="+6285813501033"
        />
      </Modal>
    </Portal>
  );
};

export default ContactSupport;
