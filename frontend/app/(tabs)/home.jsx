import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView from 'react-native-maps';
import MapZone from '../../components/MapZone';

const Home = () => {
  const stadiumPoints = [
    { latitude: 30.35927840030033, longitude: 30.394175088567142 },
    { latitude: 30.359132592615552, longitude: 30.394722259177602 },
    { latitude: 30.358181365719084, longitude: 30.39435747877063},
    { latitude: 30.35833442651126, longitude: 30.393810737054782}
  ];

  const volleyPoints = [
    { latitude: 30.35821065777552, longitude: 30.393755645568334 },
    { latitude: 30.3580229477879, longitude: 30.393943158529467 },
    { latitude: 30.35788629550364, longitude: 30.39376108415341 },
    { latitude: 30.358062225055836, longitude: 30.39356763012885 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text className="text-white text-center p-5 text-xl">Home</Text>
      <MapView
        className="flex-1"
        initialRegion={{
          latitude: 30.357810872761366,
          longitude: 30.392057112613095,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        mapType="satellite"
      >
        
        <MapZone
          points={volleyPoints}
          color="#FF0000"
          label="Volley"
        />
        <MapZone
          points={stadiumPoints}
          color="#00FF00"
          label="Stadium"
        />




      </MapView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 18,
  },
  map: {
    flex: 1,
  },
});

export default Home;
