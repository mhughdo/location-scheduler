import React, {useState, useEffect} from 'react'
import {
    SafeAreaView,
    StyleSheet,
    StatusBar,
    PermissionsAndroid,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native'
import MapScreen from './screens/MapScreen'

const App = () => {
    const [hasMapPermission, setMapPermission] = useState(false)

    const requestFineLocation = async () => {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    setMapPermission(true)
                }
            } else {
                setMapPermission(true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        requestFineLocation()
    }, [])

    return (
        <>
            <StatusBar barStyle='dark-content' />
            {hasMapPermission && (
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <SafeAreaView style={styles.container}>
                        <MapScreen />
                    </SafeAreaView>
                </TouchableWithoutFeedback>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})

export default App
