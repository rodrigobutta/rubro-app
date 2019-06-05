import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity
} from 'react-native';
// import Camera from 'react-native-camera';

import { RNCamera } from 'react-native-camera';

import Icon from 'react-native-vector-icons/Ionicons'

// let { height, width } = Dimensions.get('window');
// let orientation = height > width ? 'Portrait' : 'Landscape';


export default class CameraModule extends React.Component{     
  
  takePicture() {
    this.camera
      .capture()
      .then((data) => console.log(data))
      .catch(err => console.error(err));
  }

  render() {
  
    return (
      <RNCamera
        ref={cam => {this.camera = cam}}
        style={styles.preview}
        aspect={RNCamera.constants.Aspect.fill}
      >
        <Text style={styles.capture} onPress={this.takePicture.bind(this)}>
          [CAPTURE]
        </Text>
      </RNCamera>
    );

  }

}



const styles = StyleSheet.create({
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40  
  }
})

