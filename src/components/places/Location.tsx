import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView, 
  SafeAreaView,
  FlatList,
  Button
} from 'react-native';

import Modal from "react-native-modal";

import Icon from 'react-native-vector-icons/Ionicons';
import { FlatGrid, SectionGrid } from 'react-native-super-grid';
import { connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Spinner from "react-native-loading-spinner-overlay";

import CommonStyles from "../../utils/CommonStyles";
import * as LocationStateActions from '../../redux/actions/LocationState';


import { GooglePlacesAutocomplete } from '../../components/places/GooglePlacesAutocomplete';


const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } }};


// let { height, width } = Dimensions.get('window');
// let orientation = height > width ? 'Portrait' : 'Landscape';

class Location extends React.Component<any, any>{     
  constructor() {
    super();
    this.state = {     
      editMode: false
    };
  }

  
  goEditMode = () => {    
    this.setState({ editMode: true })
  }

  exitEditMode = () => {  
    this.setState({ editMode: false })
  }

  addLocation = () => {
    console.log('addLocation')


    const item = {title: 'item 666' }

    this.props.locationStateActions.addLocation(item);


  }


  removeLocation = (itemId) => {
    console.log('removeLocation')
    console.log(itemId)

    this.props.locationStateActions.removeLocation(itemId);

  }

  updateLocation = (itemId) => {
    console.log('updateLocation')
    console.log(itemId)


    const item = {title: 'item 2 updated' }

    this.props.locationStateActions.updateLocation(itemId, item);

  }



  _renderItem = ({item}) => (
 
      <View style={stylesList.row}>
        <View style={stylesList.row_cell_timeplace}>
          <Text style={stylesList.row_time}>{'23232'}</Text>
          <Text style={stylesList.row_place}>{item.title}</Text>
        </View>
        <Icon 
              size={32} 
              name={'ios-arrow-forward'} />
        <Text style={stylesList.row_cell_temp}>{'asa'}</Text>
      </View>
   
  );


  render() {

    const {byId,byHash} = this.props.location;
    const {editMode} = this.state;
    
    return (
  
  
      <View>

        
        <Button onPress={this.goEditMode} title={"Seleccionar Dirección"} />


        <Modal isVisible={editMode}
            onBackdropPress={this.exitEditMode}
            animationIn="zoomInDown"
            animationOut="zoomOutUp"
            animationInTiming={600}
            animationOutTiming={600}
            backdropTransitionInTiming={600}
            backdropTransitionOutTiming={600}
        >
          <View style={[styles.modalView]}>


            {byId.map((item, index) => (
              <React.Fragment key={index}>
                <Text>{byHash[item].content.title}</Text>
                <Button onPress={this.removeLocation.bind(this, item)} title={"Borrar"} />
                <Button onPress={this.updateLocation.bind(this, item)} title={"Modificar"} />
              </React.Fragment>
            ))}

              
              <FlatList
                  style={stylesList.container}
                  data={byId} 
                  renderItem={this._renderItem}
                  keyExtractor={(item) => item.id}                  
              />

              <Button onPress={this.addLocation} title={"Nueva"} />
              <Button onPress={this.exitEditMode} title={"Cancelar"} />
              <View style={{ height: 30 }} />
                      
        
              
              {/* <GooglePlacesAutocomplete
                placeholder='Search'
                minLength={2} // minimum length of text to search
                autoFocus={false}
                fetchDetails={true}
                returnKeyType={"search"}
                listViewDisplayed="false"
                renderDescription={row =>
                  row.description || row.formatted_address || row.name
                }
                onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                  console.log(data);
                  console.log(details);
                }}
                getDefaultValue={() => {
                  return ''; // text input default value
                }}
                query={{
                  // available options: https://developers.google.com/places/web-service/autocomplete
                  key: 'AIzaSyCwUBwK3A697kLrXT5FnFgbkCshtrpZTOo',
                  language: 'en', // language of the results
                  types: 'geocode', // default: 'geocode' ---- (cities)
                }}
                styles={{              
                  textInputContainer: {
                    width: '100%'
                  },
                  description: {
                    fontWeight: 'bold',
                  },
                  predefinedPlacesDescription: {
                    color: '#1faadb',
                  },
                }}
                currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                currentLocationLabel="Current location"
                nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                GoogleReverseGeocodingQuery={{
                  // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                }}
                GooglePlacesSearchQuery={{
                  // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                  rankby: 'distance',
                  // types: 'food',
                }}
                GooglePlacesDetailsQuery={{
                    // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                    fields: 'formatted_address',
                }}
                filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                predefinedPlaces={[homePlace, workPlace]}
                predefinedPlacesAlwaysVisible={true}
              /> */}

          </View>
        </Modal>
        
      </View>


    );
  }

}


export default connect(
  state => ({
    auth: state.auth,
    location: state.location
  }),
  dispatch => {
    return {
      locationStateActions: bindActionCreators(LocationStateActions, dispatch)      
    };
  }
)(Location);




const styles = StyleSheet.create({
  modalView: {    
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    backgroundColor: '#ffffff'
  }
});


const stylesList = StyleSheet.create({
  container: {
    marginTop: 14,
    alignSelf: "stretch",
  },
  row: {
    elevation: 1,
    borderRadius: 2,
    backgroundColor: '#00ff00',
    flex: 1,
    flexDirection: 'row',  // main axis
    justifyContent: 'flex-start', // main axis
    alignItems: 'center', // cross axis
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 18,
    paddingRight: 16,
    marginLeft: 14,
    marginRight: 14,
    marginTop: 0,
    marginBottom: 6,
  },
  row_cell_timeplace: {
    flex: 1,
    flexDirection: 'column',
  },
  row_cell_temp: {
    color: '#00ff00',
    paddingLeft: 16,
    flex: 0,
    fontSize: 16
  },
  row_time: {
    color: '#00ff00',
    textAlignVertical: 'bottom',
    includeFontPadding: false,
    flex: 0,
    fontSize: 12
  },
  row_place: {
    color: '#00ff00',
    textAlignVertical: 'top',
    includeFontPadding: false,
    flex: 0,
    fontSize: 16
  }
});

