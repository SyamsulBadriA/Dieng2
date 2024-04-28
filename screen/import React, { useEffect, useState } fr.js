import React, { useEffect, useState } from "react";
import { Dimensions, SafeAreaView, StyleSheet, Text, View, ActivityIndicator  } from "react-native";
import MapView, { Marker, Polyline, Callout,  Circle } from "react-native-maps";
import { Appbar } from "react-native-paper";
import BottomSheets from "../components/BottomSheets";
import ContactSupport from "../components/ContactSupport";
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import axios from 'axios';


const LOCATION_TASK_NAME = 'background-location-task';

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function App() {
  const [points, setPoints] = useState([]);
  const [points2, setPoints2] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const showModal = () => setVisible(() => !visible);

  const sendTrackingData = async (data) => {
    try {
      const response = await axios.post('http://192.168.18.254:5000/v1/submit', data);
      console.log(response.data); 
    } catch (error) {
      console.error('Kesalahan saat mengirim data tracking:', error);
    }
  };
  
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; 
    return d * 1000; 
  };
  
  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const getAndSendLocationInterval = async () => {
    let previousLocation = null;

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Izin lokasi ditolak');
        return;
      }

      const callback = async (taskData) => {
        if (taskData && taskData.locations && taskData.locations.length > 0) {
          const location = taskData.locations[0];
          if (location) {
            console.log('Latitude:', location.coords.latitude, 'Longitude:', location.coords.longitude);
            setLocation(location);
            const distance = calculateDistance(
              previousLocation.coords.latitude,
              previousLocation.coords.longitude,
              location.coords.latitude,
              location.coords.longitude
            );
      
            if (distance >= 10) { 
              sendTrackingData({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                altitude: location.coords.altitude,
                category: '75_km', 
                email: 'viomokalu@gmail.com', 
                fullname: 'Lovelyo', 
              });
      
              previousLocation = location;
            }
          }
        }
      };
      

      TaskManager.defineTask(LOCATION_TASK_NAME, callback);

      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Highest,
        // timeInterval: 10000, 
        distanceInterval: 10,
        foregroundService: {
          notificationTitle: 'Aplikasi Berjalan di Background',
          notificationBody: 'Aplikasi sedang menggunakan lokasi Anda untuk pengiriman data.',
        },
      });

    } catch (error) {
      console.error('Kesalahan saat memulai task background:', error);
      setErrorMsg('Kesalahan saat memulai task background');
    }
  };

  useEffect(() => {
    getAndSendLocationInterval();

    return () => {
      Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    };
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
            latitude: location.coords.latitude - 0.008,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.0121,
          }}
          loadingEnabled={true}
          loadingIndicatorColor="#10385b"
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10385b" />
        </View>
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






