import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TextInput,
  View,
  FlatList,
  ScrollView,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  Platform,
  ActivityIndicator,
  PixelRatio,
  Keyboard,
  Button
} from 'react-native';
import Qs from 'qs';
import debounce from 'lodash.debounce';
import Spinner from "react-native-loading-spinner-overlay";
import Modal from "react-native-modal";


import CommonStyles from "../../utils/CommonStyles";

const WINDOW = Dimensions.get('window');

const defaultStyles = {
  container: {
    flex: 1,
  },
  textInputContainer: {    
    // height: 44,
    borderTopColor: '#7e7e7e',
    borderBottomColor: '#b5b5b5',
    borderTopWidth: 1 / PixelRatio.get(),
    borderBottomWidth: 1 / PixelRatio.get(),
    flexDirection: 'row',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    height: 40,
    borderRadius: 3,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    fontSize: 16,
    flex: 1
  },
  poweredContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  powered: {},
  listView: {},
  row: {
    padding: 13,
    height: 44,
    flexDirection: 'row',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#c8c7cc',
  },
  description: {},
  loader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 20,
  },
  androidLoader: {
    marginRight: -15,
  },
};

export default class GooglePlacesAutocomplete extends Component {
  _isMounted = false;
  _results = [];
  _requests = [];

  constructor (props) {
    super(props);
    this.state = this.getInitialState.call(this);
  }

  getInitialState = () => ({
    spinner: false,
    text: this.props.getDefaultValue(),
    dataSource: this.buildRowsFromResults([]),
    listViewDisplayed: this.props.listViewDisplayed === 'auto' ? false : this.props.listViewDisplayed,
  })

  setAddressText = address => this.setState({ text: address })

  getAddressText = () => this.state.text

  buildRowsFromResults = (results) => {
    let res = [];

    if (results.length === 0 || this.props.predefinedPlacesAlwaysVisible === true) {
      res = [...this.props.predefinedPlaces];

      if (this.props.currentLocation === true) {
        res.unshift({
          description: this.props.currentLocationLabel,
          isCurrentLocation: true,
        });
      }
    }

    res = res.map(place => ({
      ...place,
      isPredefinedPlace: true
    }));

    return [...res, ...results];
  }

  componentWillMount() {
    this._request = this.props.debounce
      ? debounce(this._request, this.props.debounce)
      : this._request;
  }

  componentDidMount() {
    // This will load the default value's search results after the view has
    // been rendered
    this._handleChangeText(this.state.text);
    this._isMounted = true;
  }

  componentWillReceiveProps(nextProps) {
    let listViewDisplayed = true;

    if (nextProps.listViewDisplayed !== 'auto') {
      listViewDisplayed = nextProps.listViewDisplayed;
    }

    if (typeof (nextProps.text) !== "undefined" && this.state.text !== nextProps.text) {
      this.setState({
          listViewDisplayed: listViewDisplayed
        },
        this._handleChangeText(nextProps.text));
    } else {
      this.setState({
        listViewDisplayed: listViewDisplayed
      });
    }
  }

  componentWillUnmount() {
    this._abortRequests();
    this._isMounted = false;
  }

  _abortRequests = () => {
    this._requests.map(i => i.abort());
    this._requests = [];
  }

  /**
   * This method is exposed to parent components to focus on textInput manually.
   * @public
   */
  triggerFocus = () => {
    if (this.refs.textInput) this.refs.textInput.focus();
  }

  /**
   * This method is exposed to parent components to blur textInput manually.
   * @public
   */
  triggerBlur = () => {
    if (this.refs.textInput) this.refs.textInput.blur();
  }


  _onPress = (rowData) => {
    console.log('_onPress')

    console.log(rowData)

    this.setState({
      spinner: true,
      listViewDisplayed: false
    });

    Keyboard.dismiss();
    // this._onBlur();

    this._abortRequests();

    // fetch details
    const request = new XMLHttpRequest();
    this._requests.push(request);
    request.timeout = this.props.timeout;
    request.ontimeout = this.props.onTimeout;
    request.onreadystatechange = () => {
      if (request.readyState !== 4) return;

      if (request.status === 200) {
        const responseJSON = JSON.parse(request.responseText);

        if (responseJSON.status === 'OK') {
          if (this._isMounted === true) {
            const result = responseJSON.result;
            // this._disableRowLoaders();

            this.setState({
              spinner: false            
            });

            // this._onBlur();

            console.log(result);

            const details = this.getAddressObject(result.address_components);

            const geo = result.geometry.location;

            const formatedName = result.formatted_address;

            this.props.onPress(rowData, geo, formatedName, details);


          }
        } else {
          
          // this._disableRowLoaders();

          // if (this.props.autoFillOnNotFound) {
          //   this.setState({
          //     text: this._renderDescription(rowData)
          //   });
          //   delete rowData.isLoading;
          // }
          this.setState({
            spinner: false
          });

          this.props.onPress(rowData, null, null, null);

          // if (!this.props.onNotFound) {
          //   console.warn('google places autocomplete: ' + responseJSON.status);
          // } else {
          //   this.props.onNotFound(responseJSON);
          // }



        }
      } else {


        this.setState({
          spinner: false
        });

        this.props.onPress(rowData, null, null, null);

        // this._disableRowLoaders();

        // if (!this.props.onFail) {
        //   console.warn(
        //     'google places autocomplete: request could not be completed or has been aborted'
        //   );
        // } else {
        //   this.props.onFail('request could not be completed or has been aborted');
        // }

      }
    };

    request.open('GET', 'https://maps.googleapis.com/maps/api/place/details/json?' + Qs.stringify({
      key: this.props.query.key,
      placeid: rowData.place_id,
      language: this.props.query.language,
      // ...this.props.GooglePlacesDetailsQuery,
      fields: 'formatted_address,geometry/location,address_components'
    }));

    if (this.props.query.origin !== null) {
      request.setRequestHeader('Referer', this.props.query.origin)
    }

    request.send();

  }


  getAddressObject(address_components) {

    var ShouldBeComponent = {
      home: ["street_number"],
      postal_code: ["postal_code"],
      street: ["street_address", "route"],
      region: [
        "administrative_area_level_1",
        "administrative_area_level_2",
        "administrative_area_level_3",
        "administrative_area_level_4",
        "administrative_area_level_5"
      ],
      city: [
        "locality",
        "sublocality",
        "sublocality_level_1",
        "sublocality_level_2",
        "sublocality_level_3",
        "sublocality_level_4"
      ],
      country: ["country"]
    };

    var address = {
      home: "",
      postal_code: "",
      street: "",
      region: "",
      city: "",
      country: ""
    };
    address_components.forEach(component => {
      for (var shouldBe in ShouldBeComponent) {
        if (ShouldBeComponent[shouldBe].indexOf(component.types[0]) !== -1) {
          
          address[shouldBe] = component.short_name; // en el caso de Buenos aires y Capital el long_name es SIEMPRe "Buenos Aires", pero si uso short_name tengo "CABA" y "Buenos Aires"
          // if (shouldBe === "country") {
          //   address[shouldBe] = component.short_name;
          // } else {
          //   address[shouldBe] = component.long_name;
          // }


        }
      }
    });
    return address;
  }


  _filterResultsByTypes = (unfilteredResults, types) => {
    if (types.length === 0) return unfilteredResults;

    const results = [];
    for (let i = 0; i < unfilteredResults.length; i++) {
      let found = false;

      for (let j = 0; j < types.length; j++) {
        if (unfilteredResults[i].types.indexOf(types[j]) !== -1) {
          found = true;
          break;
        }
      }

      if (found === true) {
        results.push(unfilteredResults[i]);
      }
    }
    return results;
  }

  _request = (text) => {
    this._abortRequests();
    if (text.length >= this.props.minLength) {
      const request = new XMLHttpRequest();
      this._requests.push(request);
      request.timeout = this.props.timeout;
      request.ontimeout = this.props.onTimeout;
      request.onreadystatechange = () => {
        if (request.readyState !== 4) {
          return;
        }

        if (request.status === 200) {
          const responseJSON = JSON.parse(request.responseText);
          if (typeof responseJSON.predictions !== 'undefined') {
            if (this._isMounted === true) {
              const results = this.props.nearbyPlacesAPI === 'GoogleReverseGeocoding'
                ? this._filterResultsByTypes(responseJSON.predictions, this.props.filterReverseGeocodingByTypes)
                : responseJSON.predictions;

              this._results = results;
              this.setState({
                dataSource: this.buildRowsFromResults(results),
              });
            }
          }
          if (typeof responseJSON.error_message !== 'undefined') {
            if(!this.props.onFail)
              console.warn('google places autocomplete: ' + responseJSON.error_message);
            else{
              this.props.onFail(responseJSON.error_message)
            }
          }
        } else {
          // console.warn("google places autocomplete: request could not be completed or has been aborted");
        }
      };
      if (this.props.preProcess) {
        text = this.props.preProcess(text);
      }
      request.open('GET', 'https://maps.googleapis.com/maps/api/place/autocomplete/json?&input=' + encodeURIComponent(text) + '&' + Qs.stringify(this.props.query));
      if (this.props.query.origin !== null) {
         request.setRequestHeader('Referer', this.props.query.origin)
      }

      request.send();
    } else {
      this._results = [];
      this.setState({
        dataSource: this.buildRowsFromResults([]),
      });
    }
  }
  
  clearText(){
    this.setState({
      text: ""
    })
  }

  _onChangeText = (text) => {
    this._request(text);

    this.setState({
      text: text,
      listViewDisplayed: this._isMounted || this.props.autoFocus,
    });
  }

  _handleChangeText = (text) => {
    this._onChangeText(text);

    const onChangeText = this.props
      && this.props.textInputProps
      && this.props.textInputProps.onChangeText;

    if (onChangeText) {
      onChangeText(text);
    }
  }

  _getRowLoader() {
    return (
      <ActivityIndicator
        animating={true}
        size="small"
      />
    );
  }

  _renderRowData = (rowData) => {
    if (this.props.renderRow) {
      return this.props.renderRow(rowData);
    }

    // console.log(rowData);

    return (
      <Text style={[this.props.suppressDefaultStyles ? {} : defaultStyles.description, this.props.styles.description, rowData.isPredefinedPlace ? this.props.styles.predefinedPlacesDescription : {}]}
        numberOfLines={this.props.numberOfLines}
      >
        {this._renderDescription(rowData)}        
      </Text>
    );
  }

  _renderDescription = (rowData) => {
    if (this.props.renderDescription) {
      return this.props.renderDescription(rowData);
    }

    return rowData.description || rowData.formatted_address || rowData.name;
  }

  // _renderLoader = (rowData) => {
  //   if (rowData.isLoading === true) {
  //     return (
  //       <View style={[this.props.suppressDefaultStyles ? {} : defaultStyles.loader, this.props.styles.loader]}>
  //         {this._getRowLoader()}
  //       </View>
  //     );
  //   }

  //   return null;
  // }

  _renderRow = (rowData = {}, sectionID, rowID) => {
    return (
      <ScrollView
        style={{ flex: 1 }}
        scrollEnabled={this.props.isRowScrollable}
        keyboardShouldPersistTaps={this.props.keyboardShouldPersistTaps}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <TouchableHighlight
          style={{ width: WINDOW.width }}
          onPress={this._onPress.bind(this,rowData)}
        >
          <View style={[this.props.suppressDefaultStyles ? {} : defaultStyles.row, this.props.styles.row, rowData.isPredefinedPlace ? this.props.styles.specialItemRow : {}]}>
            {/* {this._renderLoader(rowData)} */}
            {this._renderRowData(rowData)}
          </View>
        </TouchableHighlight>
      </ScrollView>
    );
  }

  _onBlur = () => {
    this.triggerBlur();

    this.setState({
      listViewDisplayed: false
    });
  }

  _onFocus = () => this.setState({ listViewDisplayed: true })


  _renderLeftButton = () => {
    if (this.props.renderLeftButton) {
      return this.props.renderLeftButton()
    }
  }

  _renderRightButton = () => {
    if (this.props.renderRightButton) {
      return this.props.renderRightButton()
    }
  }

  _getFlatList = () => {
    const keyGenerator = () => (
      Math.random().toString(36).substr(2, 10)
    );

    if ((this.state.text !== '' || this.props.predefinedPlaces.length || this.props.currentLocation === true) && this.state.listViewDisplayed === true) {
      return (
        <FlatList                    
          data={this.state.dataSource}
          keyExtractor={keyGenerator}
          extraData={[this.state.dataSource, this.props]}          
          renderItem={({ item }) => this._renderRow(item)}
          ListHeaderComponent={this.props.renderHeaderComponent && this.props.renderHeaderComponent(this.state.text)}          
          {...this.props}
        />
      );
    }

    // return null;
  }
  render() {
    let {
      onFocus,
      clearButtonMode,
      ...userProps
    } = this.props.textInputProps;
    return (
      <View
        style={[this.props.suppressDefaultStyles ? {} : defaultStyles.container, this.props.styles.container]}
        pointerEvents="box-none"
      >

        <Spinner
          visible={this.state.spinner}
          textStyle={CommonStyles.spinnerTextStyle}
        />

        
        {!this.props.textInputHide &&
          <View
            style={[this.props.suppressDefaultStyles ? {} : defaultStyles.textInputContainer, this.props.styles.textInputContainer]}
          >
            {this._renderLeftButton()}
            <TextInput
              ref="textInput"
              editable={this.props.editable}
              returnKeyType={this.props.returnKeyType}
              keyboardAppearance={this.props.keyboardAppearance}
              autoFocus={this.props.autoFocus}
              style={[this.props.suppressDefaultStyles ? {} : defaultStyles.textInput, this.props.styles.textInput]}
              value={this.state.text}
              placeholder={this.props.placeholder}
              onSubmitEditing={this.props.onSubmitEditing}
              placeholderTextColor={this.props.placeholderTextColor}
              onFocus={onFocus ? () => {this._onFocus(); onFocus()} : this._onFocus}
              // onBlur={this._onBlur}
              underlineColorAndroid={this.props.underlineColorAndroid}
              clearButtonMode={
                clearButtonMode ? clearButtonMode : "while-editing"
              }
              { ...userProps }
              onChangeText={this._handleChangeText}
            />
            {this._renderRightButton()}
          </View>
        }
        {this._getFlatList()}
        {this.props.children}
      </View>
    );
  }
}

GooglePlacesAutocomplete.propTypes = {
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  underlineColorAndroid: PropTypes.string,
  returnKeyType: PropTypes.string,
  keyboardAppearance: PropTypes.oneOf(['default', 'light', 'dark']),
  onPress: PropTypes.func,
  onNotFound: PropTypes.func,
  onFail: PropTypes.func,
  minLength: PropTypes.number,
  fetchDetails: PropTypes.bool,
  autoFocus: PropTypes.bool,
  autoFillOnNotFound: PropTypes.bool,
  getDefaultValue: PropTypes.func,
  timeout: PropTypes.number,
  onTimeout: PropTypes.func,
  query: PropTypes.object,
  GoogleReverseGeocodingQuery: PropTypes.object,
  GooglePlacesSearchQuery: PropTypes.object,
  GooglePlacesDetailsQuery: PropTypes.object,
  styles: PropTypes.object,
  textInputProps: PropTypes.object,
  enablePoweredByContainer: PropTypes.bool,
  predefinedPlaces: PropTypes.array,
  currentLocation: PropTypes.bool,
  currentLocationLabel: PropTypes.string,
  nearbyPlacesAPI: PropTypes.string,
  enableHighAccuracyLocation: PropTypes.bool,
  filterReverseGeocodingByTypes: PropTypes.array,
  predefinedPlacesAlwaysVisible: PropTypes.bool,
  enableEmptySections: PropTypes.bool,
  renderDescription: PropTypes.func,
  renderRow: PropTypes.func,
  renderLeftButton: PropTypes.func,
  renderRightButton: PropTypes.func,
  listUnderlayColor: PropTypes.string,
  debounce: PropTypes.number,
  isRowScrollable: PropTypes.bool,
  text: PropTypes.string,
  textInputHide: PropTypes.bool,
  suppressDefaultStyles: PropTypes.bool,
  numberOfLines: PropTypes.number,
  onSubmitEditing: PropTypes.func,
  editable: PropTypes.bool
}
GooglePlacesAutocomplete.defaultProps = {
  placeholder: 'Search',
  placeholderTextColor: '#A8A8A8',
  isRowScrollable: true,
  underlineColorAndroid: 'transparent',
  returnKeyType: 'default',
  keyboardAppearance: 'default',
  onPress: () => {},
  onNotFound: () => {},
  onFail: () => {},
  minLength: 0,
  fetchDetails: false,
  autoFocus: false,
  autoFillOnNotFound: false,
  keyboardShouldPersistTaps: 'always',
  getDefaultValue: () => '',
  timeout: 20000,
  onTimeout: () => console.warn('google places autocomplete: request timeout'),
  query: {
    key: 'missing api key',
    language: 'en',
    types: 'geocode',
  },
  GoogleReverseGeocodingQuery: {},
  GooglePlacesDetailsQuery: {},
  GooglePlacesSearchQuery: {
    rankby: 'distance',
    type: 'restaurant'
  },
  styles: {},
  textInputProps: {},
  enablePoweredByContainer: true,
  predefinedPlaces: [],
  currentLocation: false,
  currentLocationLabel: 'Current location',
  nearbyPlacesAPI: 'GooglePlacesSearch',
  enableHighAccuracyLocation: true,
  filterReverseGeocodingByTypes: [],
  predefinedPlacesAlwaysVisible: false,
  enableEmptySections: true,
  listViewDisplayed: 'auto',
  debounce: 0,
  textInputHide: false,
  suppressDefaultStyles: false,
  numberOfLines: 1,
  onSubmitEditing: () => {},
  editable: true
}

// this function is still present in the library to be retrocompatible with version < 1.1.0
const create = function create(options = {}) {
  return React.createClass({
    render() {
      return (
        <GooglePlacesAutocomplete
          ref="GooglePlacesAutocomplete"
          {...options}
        />
      );
    },
  });
};

module.exports = {
  GooglePlacesAutocomplete,
  create
};