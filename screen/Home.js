import React, { useEffect, useState } from "react";
import { Dimensions, SafeAreaView, StyleSheet, Text } from "react-native";
import MapView, { Marker, Polyline, Callout, Circle } from "react-native-maps";
import { Appbar } from "react-native-paper";
import BottomSheets from "../components/BottomSheets";
import ContactSupport from "../components/ContactSupport";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { BASE_URL, sendLocation } from "../api/api";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const LOCATION_TASK_NAME = "background-location-task";

export default function App({ route }) {
  const { user } = route.params;
  const [points, setPoints] = useState([]);
  const [pointsCheck, setPointsCheckPoint] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [locations, setLocations] = useState([]);
  const [isGranted, setIsGranted] = useState(false);
  const [markers, setMarkers] = useState([]);

  TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
      console.error("Error in background task:", error.message);
      return;
    }

    if (data) {
      const { locations } = data;
      console.log("Background locations:", locations);
      const location = locations[0];
      await sendLocation(location, user);
    }
  });

  const showModal = () => setVisible(() => !visible);
  const shootLocation = async () => {
    try {
      let location = await Location.getCurrentPositionAsync({
        latitude: -7.353126,
        longitude: 109.906090,
      });
      console.log("Location shot:", location);
    } catch (error) {
      console.error("Error shooting location:", error);
    }
  };
  
  shootLocation();
  
  // Location Services
  useEffect(() => {
    const getRequestPermission = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Izin lokasi ditolak");
          return;
        }
    
        let backgroundStatus = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus.status !== "granted") {
          setErrorMsg("Izin lokasi latar belakang ditolak");
          return;
        }
    
        setIsGranted(true);
        setErrorMsg(null);
      } catch (error) {
        setErrorMsg(error);
      }
    };
    
    const startBackgroundUpdatesLocation = async () => {
      try {
        if (!isGranted) {
          setErrorMsg("Izin lokasi ditolak");
        }

        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.High,
          timeInterval: 10 * 1000,
          distanceInterval: 10,
          foregroundService: {
            notificationTitle: "Location updates enabled",
            notificationBody: "Tracking your location",
          },
        });
      } catch (error) {
        console.error("Error starting location updates:", error);
        setErrorMsg("Error starting location updates");
      }
    };

    getRequestPermission();
    startBackgroundUpdatesLocation();

    return () => {
      Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    };
  }, []);

  useEffect(() => {
    const getAndSendCurrentLocation = async () => {
      try {
        if (!isGranted) {
          setErrorMsg("Izin lokasi ditolak");
        }
        let location = await Location.getCurrentPositionAsync({});
        await sendLocation(location, user);
        setCurrentLocation(location);
        setErrorMsg(null);
      } catch (error) {
        console.error("Kesalahan saat mendapatkan lokasi:", error);
        setErrorMsg("Kesalahan saat mendapatkan lokasi");
      }
    };

    const interval = setInterval(() => {
      getAndSendCurrentLocation();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Parsing GPX
  useEffect(() => {
    const parseGPX = async () => {
      try {
        let categoryValue = "";

        switch (user.id_category) {
          case "10":
            categoryValue = "10KM_DCR.gpx";
            break;

          case "21":
            categoryValue = "21KM_DCR.gpx";
            break;

          case "42":
            categoryValue = "42KM_DCR.gpx";
            break;

          case "75":
            categoryValue = "75KM_DCR.gpx";
            break;

          default:
            categoryValue = "10KM_DCR.gpx";
            break;
        }

        const gpxUrl = `https://assajjadazis.github.io/tracks/${categoryValue}`;
        const response = await fetch(gpxUrl);
        const gpxText = await response.text();

        const regex =
          /<trkpt lat="([^"]+)" lon="([^"]+)">\s*<ele>([^<]+)<\/ele>\s*<\/trkpt>/g;
        const regexCheckPoints =
          /<wpt lat="([^"]+)" lon="([^"]+)">\s*<ele>([^<]+)<\/ele>\s*<name>([^<]+)<\/name>/g;

        let match;
        let points = [];
        let points2 = [];

        while ((match = regex.exec(gpxText)) !== null) {
          points.push({
            latitude: parseFloat(match[1]),
            longitude: parseFloat(match[2]),
          });
        }

        while ((match = regexCheckPoints.exec(gpxText)) !== null) {
          points2.push({
            latitude: parseFloat(match[1]),
            longitude: parseFloat(match[2]),
            name: match[4],
          });
        }

        setPoints(points);
        setPointsCheckPoint(points2);
      } catch (error) {
        console.error("Kesalahan saat menguraikan file GPX", error);
      }
    };

    parseGPX();
  }, []);

  // Fetch Location User
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/locations?category=${user.id_category}_km`
        );
        const dataRes = await response.json();
        setLocations(dataRes.data);
      } catch (error) {
        console.error("Kesalahan saat mengambil data lokasi:", error);
      }
    };

    fetchLocations();

    const interval = setInterval(() => {
      fetchLocations();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (locations) {
      const markers = locations.map((loc, index) => {
        if (loc.email != user.email) {
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: parseFloat(loc.latitude),
                longitude: parseFloat(loc.longitude),
              }}
              icon={require("../assets/point.png")}
              anchor={{ x: 0.1, y: 0.1 }}
            />
          );
        }
      });
      setMarkers(markers);
    }
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
      {currentLocation ? (
        <MapView
          style={styles.map}
          followsUserLocation={true}
          showsUserLocation={true}
          // padding={{ top: 0, right: 0, bottom: SCREEN_HEIGHT / 2, left: 0 }}
          initialRegion={{
            latitude: currentLocation.coords.latitude - 0.008,
            longitude: currentLocation.coords.longitude,
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
          {pointsCheck.length > 0 &&
            pointsCheck.map((point, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: point.latitude,
                  longitude: point.longitude,
                }}
                onPress={() => setSelectedMarker(point.name)}
              >
                {selectedMarker && (
                  <Callout>
                    <Text>{selectedMarker}</Text>
                  </Callout>
                )}
              </Marker>
            ))}
          {points.length > 0 &&
            points
              .filter((point) => point.name)
              .map((point, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: point.latitude,
                    longitude: point.longitude,
                  }}
                  title={point.name}
                />
              ))}
          {markers}
          {/* <Marker
            coordinate={{
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            }}
            icon={require("../assets/point (2).png")}
            anchor={{ x: 0.1, y: 0.1 }}
          /> */}
        </MapView>
      ) : (
        <Text>Loading...</Text>
      )}
      <BottomSheets styles={styles} firstName={user ? user.first_name : ''} />
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
