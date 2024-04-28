import React, { useEffect, useState } from "react";
import { Dimensions, SafeAreaView, StyleSheet, Text } from "react-native";
import MapView, { Marker, Polyline, Callout,  Circle } from "react-native-maps";
import { Appbar } from "react-native-paper";
import BottomSheets from "../components/BottomSheets";
import ContactSupport from "../components/ContactSupport";
import * as Location from 'expo-location';
import axios from 'axios';

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function App() {
  const [points, setPoints] = useState([]);
  const [points2, setPoints2] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const showModal = () => setVisible(() => !visible);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log("LOG ", location.coords.latitude, location.coords.longitude);
      Location.watchPositionAsync({distanceInterval: 10}, (newLocation) => {
        setLocation(newLocation);
        console.log("LOG ", newLocation.coords.latitude, newLocation.coords.longitude);
        axios.post('http://localhost:5000/v1/submit', {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            altitude: newLocation.coords.altitude,
            category: "75_km",
            email: "viomokalu@gmail.com",
            fullname: "Lovelyo"
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            if (error.response) {
              // console.log(error.response.data);
              // console.log(error.response.status);
              // console.log(error.response.headers);
            } else if (error.request) {
              // console.log(error.request);
            } else {
              console.log('Error', error.message);
            }
            // console.log(error.config);
          });
      });
    })();
  }, []);

  useEffect(() => {
    const parseGPX = async () => {
      try {
        const gpxUrl =
          "https://drive.google.com/uc?export=download&id=1Nq3rx6CqDcB8dQf0lOPBexSFk7Fa2uBc";
        const response = await fetch(gpxUrl);
        const gpxText = await response.text();

        const regex =
          /<trkpt lat="([^"]+)" lon="([^"]+)">\s*<ele>([^<]+)<\/ele>\s*<\/trkpt>/g;
        const regex2 =
          /<wpt lat="([^"]+)" lon="([^"]+)">\s*<ele>([^<]+)<\/ele>\s*<name>([^<]+)<\/name>\s*<cmt>([^<]+)<\/cmt>\s*<desc>([^<]+)<\/desc>/g;

        let match;
        const points = [];
        const points2 = [];
        while ((match = regex.exec(gpxText)) !== null) {
          points.push({
            latitude: parseFloat(match[1]),
            longitude: parseFloat(match[2]),
          });
        }
        while ((match = regex2.exec(gpxText)) !== null) {
          points2.push({
            latitude: parseFloat(match[1]),
            longitude: parseFloat(match[2]),
            name: match[4],
            cmt: match[5],
            desc: match[6],
          });
        }        
        setPoints(points);
        setPoints2(points2);
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
      {location ? (
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude- 0.008,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0122,
          longitudeDelta: 0.0121,
        }}
      >
        {points.length > 0 && (
          <Polyline
            coordinates={points}
            strokeColor="#027015"
            strokeWidth={5}
          />
        )}
        {points2.length > 0 && (
          points2.map((point, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: point.latitude,
                longitude: point.longitude,
              }}
              onPress={() => setSelectedMarker(point.name + " | " + point.cmt + "\n" + point.desc)}
            >
              {selectedMarker && (
                <Callout>
                  <Text>{selectedMarker}</Text>
                </Callout>
              )}
            </Marker>
          ))
        )}
        {points.length > 0 && (
          points.filter(point => point.name).map((point, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: point.latitude,
                longitude: point.longitude,
              }}
              title={point.name}
              description={point.cmt + "\n" + point.desc}
            />
          ))
        )}
         <Circle
            center={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            radius={5} 
            fillColor="rgba(255, 0, 0, 0.5)" 
            strokeColor="rgba(255, 0, 0, 0.8)" 
            strokeWidth={2} 
          />
      </MapView>
    ) : (
      <Text>Loading...</Text>
    )}
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



