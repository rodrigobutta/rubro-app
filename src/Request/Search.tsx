import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView, 
  Alert,
  Image, 
  NativeModules,
  SafeAreaView,
  Button
} from 'react-native';
// import Camera from 'react-native-camera';

import CommonStyles from "../utils/CommonStyles";

import Autocomplete from '../components/autocomplete/Autocomplete';


export default class Search extends React.Component<any, any>{     
  
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      query: ''
    };
  }


  renderListItem (item) {
      return (
          <TouchableHighlight underlayColor="#fbd42c" key={`searchlist${item.id}`}>
              <View style={styles.listItem}>
                  <Text style={styles.listItemText}>{ item.name }</Text>
              </View>
          </TouchableHighlight>
      )
  }


  componentDidMount() {



    const items = [
      {
        "id": "1",
        "name": "Plomeria",
        "type": "1"
      },
      {
        "id": "2",
        "name": "Cerrajeria",
        "type": "1"
      },
      {
        "id": "3",
        "name": "Pintura",
        "type": "1"
      },
      {
        "id": "4",
        "name": "Albañilería",
        "type": "1"
      },
      {
        "id": "5",
        "name": "Carpintería",
        "type": "1"
      },
      {
        "id": "6",
        "name": "Electricidad e Iluminación",
        "type": "1"
      },
      {
        "id": "7",
        "name": "cambio de cerradura",
        "type": "2"
      },
      {
        "id": "8",
        "name": "colocación de ventana",
        "type": "2"
      },
      {
        "id": "9",
        "name": "colocación de puerta",
        "type": "2"
      },
      {
        "id": "10",
        "name": "colocación de artefacto de luz",
        "type": "2"
      },
      {
        "id": "11",
        "name": "destapar sanitario",
        "type": "2"
      },
      {
        "id": "12",
        "name": "colocación de grifería",
        "type": "2"
      },
      {
        "id": "13",
        "name": "humedad",
        "type": "2"
      },
      {
        "id": "14",
        "name": "cerramientos",
        "type": "1"
      }
    ]

    this.setState({ items });

  }


  render() {

    const { items } = this.state;
    
    return (

      <SafeAreaView style={CommonStyles.safeAreaContainer}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }} >

          <Text style={{ fontSize: 22, marginBottom: 10 }}>
            ¿Qué estás necesitando?
          </Text>
            
          <Autocomplete
              list={items}
              renderListItem={(item) => this.renderListItem(item)}
              startSuggestingFrom={2}
              inputStyle={styles.searchInput}
              suggestBoxStyle={styles.suggestBox}
              suggestBoxMaxHeight={220}
              placeholder="plomero, destapar baño, .."
          />

        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#f2f2f2',
      padding: 15
  },
  searchInput: {
      height: 50,
      borderColor: '#f2f2f2',
      borderWidth: 1,
      paddingLeft: 10,
      backgroundColor: '#fff'
  },
  suggestBox: {
    backgroundColor: '#fff',
    marginTop: 10,
    height: 220,
},
  listItem: {
      width: '100%',
      flex: 1,
      flexDirection: 'row',
      height: 55,
      paddingLeft: 10,
      paddingRight: 10,
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderColor: '#e5e5e5',

  },
  listItemText: {
      fontSize: 20
  }
})