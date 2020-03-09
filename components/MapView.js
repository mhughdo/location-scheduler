import MapView, {Marker} from 'react-native-maps' // remove PROVIDER_GOOGLE import if not using Google Maps
import React from 'react'
import {View, StyleSheet} from 'react-native'

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        // height: 400,
        // width: 400,
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
})

const MapViewer = ({userLocation, destinationLocation}) => {
    const marker = destinationLocation.latitude ? <Marker coordinate={destinationLocation} /> : null

    return (
        <View style={styles.container}>
            <MapView
                showsUserLocation
                followsUserLocation
                style={styles.map}
                region={{
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }}>
                {marker}
            </MapView>
        </View>
    )
}

export default MapViewer
