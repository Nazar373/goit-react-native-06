import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { clockRunning } from "react-native-reanimated";

const MapScreen = ({ route }) => {
  const {latitude, longitude} = route.params.location
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        }}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title="travel photo"
        />
      </MapView>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
