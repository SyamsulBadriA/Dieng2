import { Divider } from "@react-native-material/core";
import React from "react";
import { Dimensions, Text, View } from "react-native";
import { Avatar } from "react-native-paper";
import * as Progress from "react-native-progress";

const { width: SCREEN_WIDTH } = Dimensions.get("screen");

const BottomSheets = ({ styles, firstName }) => {
  console.log("firstName:", firstName);
  return (
    <View style={styles.bottomSheet}>
      <View style={styles.line} />
      <View style={styles.profileLocation}>
        <View style={styles.wrapProfile}>
          <Avatar.Image source={require("../assets/icon.png")} />
          <View style={styles.profileText}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {firstName}
            </Text>
            <Text>10 km . 90 min</Text>
          </View>
        </View>
        <Avatar.Icon
          size={45}
          color="#10385b"
          style={styles.profileTime}
          icon="map-marker-account-outline"
        />
      </View>
      <View style={styles.progressBarWrap}>
        <Avatar.Icon
          style={styles.progressBarIcon}
          color="grey"
          size={40}
          icon="map-marker-account-outline"
        />
        <Progress.Bar
          style={styles.progressBar}
          progress={0.1}
          width={SCREEN_WIDTH / 1.5}
          color="#10385b"
        />
        <Avatar.Icon
          style={styles.progressBarIcon}
          color="green"
          size={40}
          icon="map-marker-check-outline"
        />
      </View>
      <Divider
        color="grey"
        style={{ borderRadius: 20, opacity: 0.5 }}
        leadingInset={20}
        trailingInset={20}
      />
    </View>
  );
};

export default BottomSheets;
