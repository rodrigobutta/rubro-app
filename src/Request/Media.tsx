import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView, 
  Alert,
  Image, 
  Button,
  NativeModules
} from 'react-native';
// import Camera from 'react-native-camera';

import ImagePicker from 'react-native-image-crop-picker';

import Video from 'react-native-video';

import Icon from 'react-native-vector-icons/Ionicons'

// let { height, width } = Dimensions.get('window');
// let orientation = height > width ? 'Portrait' : 'Landscape';

import ActionSheet from 'react-native-actionsheet';


export default class Media extends React.Component<any, any>{     
  constructor() {
    super();
    this.state = {
      images: []
    };
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
    return (<View style={{height: 300, width: 300}}>
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
     </View>);
  }

  renderImage(image) {
    return <Image style={{width: 300, height: 300, resizeMode: 'contain'}} source={image} />
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


  render() {

    var optionArray = [
      'Cámara de fotos',
      'Camara de video',
      'Galeria de imagenes',      
      'Cancelar',
    ];

    return (<View style={styles.container}>
      <ScrollView>
        {this.state.image ? this.renderAsset(this.state.image) : null}
        {this.state.images ? this.state.images.map(i => <View key={i.uri}>{this.renderAsset(i)}</View>) : null}
      </ScrollView>


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


    </View>);
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    backgroundColor: 'blue',
    marginBottom: 10
  },
  text: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center'
  }
});