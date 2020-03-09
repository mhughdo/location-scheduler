import React, {useState, useEffect} from 'react'
import {Container} from 'native-base'
import Geolocation from '@react-native-community/geolocation'
import axios from 'axios'
import * as geolib from 'geolib'
import {Vibration, Alert, Text, StyleSheet, View} from 'react-native'
import PlaceInput from '../components/PlaceInput'
import MapView from '../components/MapView'

const API_KEY = 'AIzaSyBhzGfgNfKpi3KXR3XUFsE-gsG55LTMaZ4'

// 20.940635 106.056970
// 20.9152008  106.1113592

const MapScreen = () => {
    const [userLocation, setUserLocation] = useState({
        latitude: 21.027763,
        longitude: 105.83416,
    })

    const [destinationLocation, setDestinationLocation] = useState({})

    const [inRange, setInRange] = useState(false)
    const [distance, setDistance] = useState()

    const checkInRange = ({
        latitude = userLocation.latitude,
        longitude = userLocation.longitude,
        desLatitude = destinationLocation.latitude,
        desLongtitude = destinationLocation.longitude,
    }) => {
        const isInDestination = geolib.isPointWithinRadius(
            {latitude, longitude},
            {latitude: desLatitude, longitude: desLongtitude},
            1000
        )

        const newDistance = geolib.getDistance({latitude, longitude}, {latitude: desLatitude, longitude: desLongtitude})
        console.log('new Distance', newDistance)
        setDistance(newDistance)
        if (isInDestination) {
            console.log('In rangeee')

            // Alert.alert('Almost there', `You are ${newDistance} meters from destination`, [
            //     {text: 'OK', onPress: () => console.log('OK Pressed')},
            // ])
            Vibration.vibrate(3000)
            setInRange(true)
            return
        }
        console.log('Not in range')
    }

    const getPlaceDetails = async placeID => {
        try {
            const {
                data: {
                    result: {
                        geometry: {location},
                    },
                },
            } = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
                params: {
                    key: API_KEY,
                    place_id: placeID,
                    fields: 'geometry',
                },
            })

            console.log('location', location)
            checkInRange({desLatitude: location.lat, desLongtitude: location.lng})
            setDestinationLocation({
                latitude: location.lat,
                longitude: location.lng,
            })
        } catch (error) {
            console.log(error)
        }
    }

    const showDirectionsOnMap = async placeID => {
        try {
            console.log(placeID)

            const {data} = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
                params: {
                    origin: `${userLocation.latitude},${userLocation.longitude}`,
                    destination: `place_id:${placeID}`,
                    key: API_KEY,
                },
            })
        } catch (error) {
            console.log(error.response.data.error_message)
        }
    }

    const clearState = () => {
        setDestinationLocation({})
        setDistance(null)
    }

    useEffect(() => {
        const locationWatcher = Geolocation.watchPosition(
            pos => {
                console.log('new Pos', pos)
                const {latitude, longitude} = pos.coords
                if (destinationLocation.latitude) {
                    checkInRange({latitude, longitude})
                }

                setUserLocation({
                    latitude,
                    longitude,
                })
            },
            error => console.log('Error get user location', error),
            {enableHighAccuracy: false, timeout: 5000, maximumAge: 10000}
        )

        return () => {
            Geolocation.clearWatch(locationWatcher)
        }
    }, [])

    return (
        <Container>
            <MapView userLocation={userLocation} destinationLocation={destinationLocation} />
            <PlaceInput userLocation={userLocation} getPlaceDetails={getPlaceDetails} clearState={clearState} />
            {distance && (
                <View style={styles.distanceContainer}>
                    <Text style={styles.distanceText}>{`You are ${distance} meters away from destination`}</Text>
                </View>
            )}
        </Container>
    )
}

const styles = StyleSheet.create({
    distanceContainer: {
        // backgroundColor: 'red',
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
    },
    distanceText: {
        fontSize: 16,
    },
})

export default MapScreen
