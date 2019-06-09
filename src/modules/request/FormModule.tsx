import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView, 
  SafeAreaView,
  Image, 
  Button
} from 'react-native';

import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import { FlatGrid, SectionGrid } from 'react-native-super-grid';
import { connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Spinner from "react-native-loading-spinner-overlay";

import CommonStyles from "../../utils/CommonStyles";
import * as RequestStateActions from './RequestState';


import GooglePlacesAutocomplete from '../../components/places/GooglePlacesAutocomplete';
import Location from '../../components/places/Location';


const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } }};


// let { height, width } = Dimensions.get('window');
// let orientation = height > width ? 'Portrait' : 'Landscape';

class FormModule extends React.Component<any, any>{     
  constructor() {
    super();
    this.state = {
      images: [],
      description: '',
      loc: ''
    };
  }


  /// state value updated from child component map;
  handler(arg) {
    this.setState({
      loc: arg
    });
    return;
  }



  pickSingleWithCamera(cropping, mediaType='photo') {
    ImagePicker.openCamera({
      cropping: cropping,
      width: 500,
      height: 500,
      includeExif: true,
      mediaType,
    }).then(image => {
      console.log('received image', image);


      const newImage = {uri: image.path, width: image.width, height: image.height, mime: image.mime};

      this.setState(state => {
        const images = state.images.concat(newImage);
  
        return {
          images,
          newImage,
        };
      });



    }).catch(e => alert(e));
  }


  pickMultiple() {
    ImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: false,
      includeExif: true,
      forceJpg: true,
    }).then(images => {
      this.setState({
        images: images.map(i => {
          console.log('received image', i);
          return {uri: i.path, width: i.width, height: i.height, mime: i.mime};
        })
      });
    }).catch(e => alert(e));
  }

  scaledHeight(oldW, oldH, newW) {
    return (oldH / oldW) * newW;
  }

  renderVideo(video) {
    console.log('rendering video');
    return (
      <View style={{height: 300, width: 300}}>
        <Video source={{uri: video.uri, type: video.mime}}
          style={{position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0
            }}
          rate={1}
          paused={false}
          volume={1}
          muted={false}
          resizeMode={'cover'}
          onError={e => console.log(e)}
          onLoad={load => console.log(load)}
          repeat={true} />
      </View>
    );
  }

  renderImage(image) {
    return <Image 
            source={image} 
            style={{
              alignSelf: 'center',
              height: 150,
              width: 150,
              borderWidth: 0,
              borderRadius: 5
            }}
            resizeMode="cover"
            />
  }

  renderAsset(image) {
    if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
      return this.renderVideo(image);
    }

    return this.renderImage(image);
  }


  showActionSheet = () => {    
    this.ActionSheet.show();
  };

  actionSheetItemOnPress = (index) => {    

    switch (index) {
      case 0:
        this.pickSingleWithCamera(false)
        break;

      case 1:
        this.pickSingleWithCamera(false, mediaType='video')
        break;

      case 2:
        this.pickMultiple()
        break;

      default:
        break;
    }

  };




  componentWillMount() {

    // TODO ojo que los reducers estos me estan metiendo cosas que no van, auth en request y demas. PERFORMANCE
    // console.log(this.props.request)

  }





  render() {

    var optionArray = [
      'Cámara de fotos',
      'Camara de video',
      'Galeria de imagenes',      
      'Cancelar',
    ];

    const {images} = this.state;
    const {category} = this.props.request;

    return (
      
      <SafeAreaView style={[CommonStyles.safeAreaContainer, {backgroundColor:'#ffffff'}]}>
        <Spinner
          visible={this.state.spinner}
          textStyle={CommonStyles.spinnerTextStyle}
        />
        
        <ScrollView style={CommonStyles.scrollView}>

          <View style={CommonStyles.page}>

            <Text style={{ fontSize: 22, marginBottom: 10 }}>
              Solicitar {category.name}
            </Text>

            <TextInput
              multiline={false}
              numberOfLines={4}
              onChangeText={(subject) => this.setState({subject})}
              value={this.state.subject}
              style={[CommonStyles.textInput]}
            />

            <TextInput
              multiline={true}
              numberOfLines={4}
              onChangeText={(description) => this.setState({description})}
              value={this.state.description}
              style={[CommonStyles.textArea, styles.textArea]}            
            />

            <Location />

{/* 
            <GooglePlacesAutocomplete
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


  {/* 
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              >
              {images ? images.map(i => <View key={i.uri}>{this.renderAsset(i)}</View>) : null}
            </ScrollView> */}

            <FlatGrid
              itemDimension={150}
              items={images}
              style={styles.gridView}            
              renderItem={({ item, index }) => (
                <View key={index} style={[styles.itemContainer]}>
                  {this.renderAsset(item)}
                </View>
              )}
            />
            
            {/* <Button onPress={() => this.pickSingleWithCamera(false)} title={"Foto"} />
            <View style={{ height: 30 }} />
            <Button onPress={() => this.pickSingleWithCamera(false, mediaType='video')} title={"Video"} />
            <View style={{ height: 30 }} />
            <Button onPress={this.pickMultiple.bind(this)} title={"Galeria"} /> */}

            <Button
              onPress={this.showActionSheet}
              title="Agregar"
            />
            <ActionSheet
              ref={o => (this.ActionSheet = o)}          
              title={'Agregar..'}          
              options={optionArray}          
              cancelButtonIndex={3}          
              // destructiveButtonIndex={1}
              onPress={this.actionSheetItemOnPress}
            />


            
          </View>

        </ScrollView>

      </SafeAreaView>

    );
  }

}


export default connect(
  state => ({
    auth: state.auth,
    request: state.request
  }),
  dispatch => {
    return {
      requestStateActions: bindActionCreators(RequestStateActions, dispatch)      
    };
  }
)(FormModule);





const styles = StyleSheet.create({
  button: {
    backgroundColor: 'blue',
    marginBottom: 10
  },
  text: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center'
  },
  gridView: {
    marginTop: 20,
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    padding: 10,
    height: 150,
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
  textArea: {
    // fontSize: 16,
    // color: '#111',
    // backgroundColor: '#eee',
  },
});

