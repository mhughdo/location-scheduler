import React, {useState, useCallback} from 'react'
import {Input, Item, List, ListItem} from 'native-base'
import {View, StyleSheet, FlatList, Text, Keyboard} from 'react-native'
import axios from 'axios'
import debounce from 'lodash.debounce'

const PlaceInput = ({userLocation, getPlaceDetails, clearState}) => {
    const [input, setInput] = useState('')
    const [predictions, setPredictions] = useState([])
    const [visible, setVisible] = useState(true)

    const getPlaces = async input => {
        try {
            if (input) {
                console.log(input)
                const API_KEY = 'AIzaSyAuUgxJ6jhPb_a7LajxZDJSBNr8At0CWxY'

                const {data} = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
                    params: {
                        key: API_KEY,
                        input: input.replace(/\s/gi, '+'),
                        location: `${userLocation.latitude}, ${userLocation.longitude}`,
                    },
                })

                if (data.predictions) {
                    console.log(data.predictions)
                    setPredictions(data.predictions)
                }
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const debouncedGetPlaces = useCallback(debounce(getPlaces, 1000), [])

    return (
        <View>
            <Item regular>
                <Input
                    value={input}
                    style={styles.input}
                    placeholder='Search here'
                    onFocus={() => {
                        setVisible(true)
                    }}
                    onChangeText={input => {
                        setInput(input)
                        setPredictions([])
                        clearState()
                        debouncedGetPlaces(input)
                    }}
                />
            </Item>
            {visible && (
                <FlatList
                    data={predictions}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => {
                        const {
                            description,
                            place_id,
                            structured_formatting: {main_text: mainText},
                        } = item
                        return (
                            <List>
                                <ListItem
                                    style={styles.suggestionContainer}
                                    onPress={() => {
                                        setInput(mainText)
                                        setVisible(false)
                                        getPlaceDetails(place_id)
                                        Keyboard.dismiss()
                                    }}>
                                    <Text style={styles.mainText}>{mainText}</Text>
                                    <Text style={styles.secondaryText}>{description}</Text>
                                </ListItem>
                            </List>
                        )
                    }}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#fff',
        marginTop: 10,
        marginHorizontal: 10,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    mainText: {
        // alignItems: 'flex-start',
        alignSelf: 'flex-start',
    },
    secondaryText: {
        fontSize: 14,
        alignSelf: 'flex-start',
        color: '#777',
    },
    suggestionContainer: {
        backgroundColor: '#fff',
        marginHorizontal: 10,
        padding: 10,
        flexDirection: 'column',
    },
})

export default PlaceInput
