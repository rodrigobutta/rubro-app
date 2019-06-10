import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView, 
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Button
} from 'react-native';

import Modal from "react-native-modal";

import Icon from 'react-native-vector-icons/Ionicons';
import { FlatGrid, SectionGrid } from 'react-native-super-grid';
import { connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Spinner from "react-native-loading-spinner-overlay";
import ActionSheet from 'react-native-actionsheet';

import CommonStyles from "../../utils/CommonStyles";
import * as LocationStateActions from '../../redux/actions/LocationState';


import _ from 'lodash';

import { GooglePlacesAutocomplete } from '../../components/places/GooglePlacesAutocomplete';


const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } }};


// let { height, width } = Dimensions.get('window');
// let orientation = height > width ? 'Portrait' : 'Landscape';

class Location extends React.Component<any, any>{     
  constructor() {
    super();
    this.state = {     
      editMode: false,
      currentItem: null
    };
  }

  
  goEditMode = () => {    
    this.setState({ editMode: true })
  }

  exitEditMode = () => {  
    this.setState({ editMode: false })
  }

  addLocation = (object) => {
    console.log('addLocation')


    console.log(object)

    const item = {title: 'item 666' }

    this.props.locationStateActions.addLocation(item);


  }



  showItemActionSheet = (item) => {    
    this.setState({ currentItem: item })
    this.ActionSheet.show();
  };

  actionSheetItemOnPress = (index) => {    

    const id = this.state.currentItem.id;

    switch (index) {
      case 0:

        this.props.locationStateActions.removeLocation(id);
        break;

      case 1:

        const item = {title: 'item AGEGADO' }

        this.props.locationStateActions.updateLocation(id, item);
        
        
        break;

      default:
        break;
    }

  };


  newAddressSelected = (place, geo, formattedName, details) => {    
    
    console.log(place)
    console.log(geo)
    console.log(formattedName)
    console.log(details)
    
    const item = {
      title: place.structured_formatting.main_text,
      subtitle: place.structured_formatting.secondary_text,
      address: place.description,
      place: {
        id: place.place_id ,
        formattedName: formattedName,
        ...details,
        ...geo
      }      
    }

    console.log(item)

    this.props.locationStateActions.addLocation(item);

  };


  _renderItem = ({item}) => (
 
      <TouchableOpacity
        accessibilityLabel={item.content.title}
        accessibilityRole="button"                        
        // onPress={onPress}
        onLongPress={this.showItemActionSheet.bind(this, item)}
        
      >
        <View style={stylesList.row}>
          <View style={stylesList.row_cell_timeplace}>
            <Text style={stylesList.title}>{item.content.title}</Text>
            <Text style={stylesList.id}>{item.content.subtitle || ''}</Text>
          </View>
          <Icon 
                size={32} 
                name={'ios-arrow-forward'} />              
        </View>
      </TouchableOpacity>
  );


  render() {

    const {byId,byHash} = this.props.location;
    const {editMode} = this.state;
    
    var optionArray = [
      'Eliminar',
      'Agregar a Favoritas',
      'Cancelar'      
    ];


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

          <ScrollView style={CommonStyles.scrollView}>
          <View style={[styles.modalView]}>



            <GooglePlacesAutocomplete
              placeholder='Escribir calle y altura..'
              minLength={3} // minimum length of text to search
              autoFocus={false}
              fetchDetails={true}
              returnKeyType={"search"}
              listViewDisplayed="false"
              // renderDescription={row =>
              //   row.description || row.formatted_address || row.name
              // }
              onPress={(place, geo, formattedName, details) => this.newAddressSelected(place, geo, formattedName, details)}
              getDefaultValue={() => {
                return ''; // text input default value
              }}
              query={{
                // available options: https://developers.google.com/places/web-service/autocomplete
                key: 'AIzaSyCwUBwK3A697kLrXT5FnFgbkCshtrpZTOo',
                language: 'en', // language of the results
                // types: 'geocode', // default: 'geocode' ---- (cities)
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
              currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
              // currentLocationLabel="Current location"
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
                  // fields: 'formatted_address,geometry/location,address_components',
              }}
              filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
              // predefinedPlaces={[homePlace, workPlace]}
              predefinedPlacesAlwaysVisible={false}
            />



            {/* {byId.map((item, index) => (
              <React.Fragment key={index}>
                <Text>{byHash[item].content.title}</Text>
                <Button onPress={this.removeLocation.bind(this, item)} title={"Borrar"} />
                <Button onPress={this.updateLocation.bind(this, item)} title={"Modificar"} />
              </React.Fragment>
            ))} */}

              
              <FlatList
                  style={stylesList.container}
                  data={_.values(byHash)} 
                  renderItem={this._renderItem}
                  keyExtractor={(item) => item.id}                  
              />


              <ActionSheet
                ref={o => (this.ActionSheet = o)}          
                title={'Agregar..'}          
                options={optionArray}          
                cancelButtonIndex={2}          
                // destructiveButtonIndex={1}
                onPress={this.actionSheetItemOnPress}
              />

              <Button onPress={this.addLocation} title={"Nueva"} />
           
              <View style={{ height: 30 }} />
                      
        
              

              <Button onPress={this.exitEditMode} title={"Cancelar"} />

          </View>
          </ScrollView>

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
    backgroundColor: '#ffffff',
    flex: 1,
    flexDirection: 'row',  // main axis
    justifyContent: 'flex-start', // main axis
    alignItems: 'center', // cross axis
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 18,
    paddingRight: 16,
    // marginLeft: 14,
    // marginRight: 14,
    marginTop: 0,
    marginBottom: 6,
  },
  row_cell_timeplace: {
    flex: 1,
    flexDirection: 'column',
  },
  row_cell_temp: {
    color: '#ffff00',
    paddingLeft: 16,
    flex: 0,
    fontSize: 16
  },
  id: {
    color: '#999999',
    textAlignVertical: 'bottom',
    includeFontPadding: false,
    flex: 0,
    fontSize: 12
  },
  title: {
    color: '#111111',
    textAlignVertical: 'top',
    includeFontPadding: false,
    flex: 0,
    fontSize: 16
  }
});

