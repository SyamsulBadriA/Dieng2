import React, { useEffect, useState } from "react";
import { Dimensions, SafeAreaView, StyleSheet, Text } from "react-native";
import MapView, { Marker, Polyline, Callout,  Circle } from "react-native-maps";
import { Appbar } from "react-native-paper";
import BottomSheets from "../components/BottomSheets";
import ContactSupport from "../components/ContactSupport";
import * as Location from 'expo-location';
import axios from 'axios';
import * as TaskManager from 'expo-task-manager';


const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask('background-location-task', async ({ data, error }) => {
  if (error) {
    console.error('Error in background task:', error.message);
    return;
  }

  if (data) {
    const { locations } = data;
    console.log('Background locations:', locations);
  }
});
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const sendTrackingData = async (data) => {
  try {
    const response = await axios.post('http://192.168.18.254:5000/v1/submit', data);
    console.log(response.data);
  } catch (error) {
    console.error('Kesalahan saat mengirim data tracking:', error);
  }
};

export default function App() {
  const [points, setPoints] = useState([]);
  const [points2, setPoints2] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [locations, setLocations] = useState([]);
  const [markers, setMarkers] = useState([]);

  const showModal = () => setVisible(() => !visible);

  useEffect(() => {
    const getLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Izin lokasi ditolak');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        setErrorMsg(null);
      } catch (error) {
        console.error('Kesalahan saat mendapatkan lokasi:', error);
        setErrorMsg('Kesalahan saat mendapatkan lokasi');
      }
    };
  
    getLocation();
  
  }, []);
  
  useEffect(() => {
    const getAndSendLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Izin lokasi ditolak');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        setErrorMsg(null);
  
        sendTrackingData({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          altitude: location.coords.altitude,
          category: '75_km',
          email: 'viomokalu@gmail.com',
          fullname: 'Lovelyo',
        });
      } catch (error) {
        console.error('Kesalahan saat mendapatkan lokasi:', error);
        setErrorMsg('Kesalahan saat mendapatkan lokasi');
      }
    };
  
    const startLocationUpdates = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Izin lokasi ditolak');
          return;
        }
  
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.High,
          timeInterval: 10 * 1000, 
          distanceInterval: 10, 
          foregroundService: {
            notificationTitle: 'Location updates enabled',
            notificationBody: 'Tracking your location',
          },
        });
      } catch (error) {
        console.error('Error starting location updates:', error);
        setErrorMsg('Error starting location updates');
      }
    };
  
    getAndSendLocation();
    startLocationUpdates();
  
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

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://192.168.18.254:5000/v1/locations');
        //console.log(response.data);
        setLocations(response.data);
      } catch (error) {
        console.error('Kesalahan saat mengambil data lokasi:', error);
      }
    };

    fetchLocations();

    const interval = setInterval(() => {
      fetchLocations();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const markers = locations.map((location, index) => (
      <Marker
        key={index}
        coordinate={{
          latitude: location.latitude,
          longitude: location.longitude,
        }}
        icon={require('../assets/favicon.png')}
        anchor={{ x: 0.1, y: 0.1 }} 
      />
    ));

    setMarkers(markers);
  }, [locations]);

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
        {markers}
         <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            icon={require('../assets/favicon.png')}
            anchor={{ x: 0.1, y: 0.1 }} 
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
