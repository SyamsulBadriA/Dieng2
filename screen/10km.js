import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import xml2js from 'react-native-xml2js';

export default function App() {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    const parseGPX = async () => {
      try {
        const gpxUrl = 'https://drive.google.com/uc?export=download&id=1Nq3rx6CqDcB8dQf0lOPBexSFk7Fa2uBc';
        const response = await fetch(gpxUrl);
        const gpxText = await response.text();

        const regex = /<trkpt lat="([^"]+)" lon="([^"]+)">\s*<ele>([^<]+)<\/ele>\s*<\/trkpt>/g;

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
        console.error('Kesalahan saat menguraikan file GPX', error);
      }
    };

    parseGPX();
  }, []);

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        initialRegion={{
          latitude: points.length > 0 ? points[0].latitude : -7.27019559524664,
          longitude: points.length > 0 ? points[0].longitude :  109.972937139457002,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {points.length > 0 && (
          <Polyline
            coordinates={points}
            strokeColor="#000"
            strokeWidth={6}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
