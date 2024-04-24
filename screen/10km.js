import React, { useEffect, useState } from "react";
import { Dimensions, SafeAreaView, StyleSheet } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Appbar } from "react-native-paper";
import BottomSheets from "../components/BottomSheets";
import ContactSupport from "../components/ContactSupport";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function App() {
  const [points, setPoints] = useState([]);
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(() => !visible);

  useEffect(() => {
    const parseGPX = async () => {
      try {
        const gpxUrl =
          "https://drive.google.com/uc?export=download&id=1Nq3rx6CqDcB8dQf0lOPBexSFk7Fa2uBc";
        const response = await fetch(gpxUrl);
        const gpxText = await response.text();

        const regex =
          /<trkpt lat="([^"]+)" lon="([^"]+)">\s*<ele>([^<]+)<\/ele>\s*<\/trkpt>/g;

        let match;
        const points = [];
        while ((match = regex.exec(gpxText)) !== null) {
          points.push({
            latitude: parseFloat(match[1]),
            longitude: parseFloat(match[2]),
          });
        }
        setPoints(points);
      } catch (error) {
        console.error("Kesalahan saat menguraikan file GPX", error);
      }
    };

    parseGPX();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ContactSupport showModal={showModal} visible={visible} styles={styles} />
      <Appbar.Header theme={{ colors: { primaryContainer: "#10385b" } }}>
        <Appbar.Content
          title="Tracking View"
          titleStyle={{ fontWeight: "bold" }}
        />
        <Appbar.Action icon="headset" onPress={showModal} />
      </Appbar.Header>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: points.length > 0 ? points[0].latitude : -7.27019559524664,
          longitude:
            points.length > 0 ? points[0].longitude : 109.972937139457002,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {points.length > 0 && (
          <Polyline
            coordinates={points}
            strokeColor="#10385b"
            strokeWidth={3}
          />
        )}
        <Marker
          coordinate={{
            latitude: -7.27019559524664,
            longitude: 109.972937139457002,
          }}
        />
      </MapView>
      <BottomSheets styles={styles} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomSheet: {
    height: SCREEN_HEIGHT,
    width: "100%",
    backgroundColor: "white",
    position: "absolute",
    top: SCREEN_HEIGHT / 1.5,
    borderRadius: 25,
    paddingHorizontal: 20,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: "grey",
    alignSelf: "center",
    marginVertical: 15,
  },
  wrapProfile: {
    flexDirection: "row",
  },
  profileTime: {
    alignSelf: "center",
    backgroundColor: "white",
    borderColor: "grey",
    borderWidth: 0.5,
  },
  profileLocation: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  profileText: {
    marginHorizontal: 10,
    alignSelf: "center",
    width: "55%",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  progressBar: {
    alignSelf: "center",
  },
  progressBarWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  progressBarIcon: {
    backgroundColor: "transparent",
  },
  modalContactSupport: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  callIcon: {
    borderColor: "grey",
    backgroundColor: "transparent",
    borderWidth: 0.5,
  },
});
