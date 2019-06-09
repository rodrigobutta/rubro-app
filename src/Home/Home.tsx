import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,  
  SafeAreaView,
  TouchableHighlight
} from "react-native";
import { connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {NavigationActions} from 'react-navigation';

import CommonStyles from "../utils/CommonStyles";
import MainMenuBurguer from "../utils/MainMenuBurguer";
// import { navigationOption/utils/CommonStyles";
import Autocomplete from '../components/autocomplete/Autocomplete';
import { SectionGrid } from 'react-native-super-grid';
import * as RequestStateActions from '../modules/request/RequestState';

class Home extends React.Component<any, any>{    
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Inicio',
      headerLeft: (
        <MainMenuBurguer navigation={navigation} badge={1}  />                
      )      
    };
  };


  constructor(props) {
    super(props);
    
    this.state = {
      categories: [],
      suggested: [],
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

  
  onCategoryClick = (item) => {
    console.log(item)

    this.props.requestStateActions.setCategory(item);

    this.props.navigation.navigate('RequestFormModule');

  }


  componentWillMount() {

    const categories = [
      {
        id: 1,
        name: 'plomeria',
        type: 1,
        color: '#1abc9c'
      },
      {
        id: 2,
        name: 'cerrajeria',
        type: 1,
        color: '#2ecc71'
      },
      {
        id: 3,
        name: 'pintura',
        type: 1,
        color: '#3498db'
      },
      {
        id: 4,
        name: 'albañilería',
        type: 1,
        color: '#9b59b6'
      },
      {
        id: 5,
        name: 'carpintería',
        type: 1,
        color: '#8e44ad'
      },
      {
        id: 6,
        name: 'electricidad e iluminación',
        type: 1,
        color: '#16a085'
      },
      {
        id: 7,
        name: 'cambio de cerradura',
        type: 2,
        color: '#2c3e50'
      },
      {
        id: 8,
        name: 'colocación de ventana',
        type: 2,
        color: '#e74c3c'
      },
      {
        id: 9,
        name: 'colocación de puerta',
        type: 2,
        color: '#ecf0f1'
      },
      {
        id: 10,
        name: 'colocación de artefacto de luz',
        type: 2,
        color: '#95a5a6'
      },
      {
        id: 11,
        name: 'destapar sanitario',
        type: 2,
        color: '#f39c12'
      },
      {
        id: 12,
        name: 'colocación de grifería',
        type: 2,
        color: '#d35400'
      },
      {
        id: 13,
        name: 'humedad',
        type: 2,
        color: '#bdc3c7'
      },
      {
        id: 14,
        name: 'cerramientos',
        type: 1,
        color: '#7f8c8d'
      },
      {
        id: 15,
        name: 'cambio de lamparita',
        type: 1,
        color: '#7f8c8d'
      },
      {
        id: 16,
        name: 'cambio de bateria',
        type: 1,
        color: '#7f8c8d'
      },
      {
        id: 17,
        name: 'auxilio mecánico',
        type: 1,
        color: '#7f8c8d'
      },    
      {
        id: 18,
        name: 'gomería',
        type: 1,
        color: '#7f8c8d'
      },
      {
        id: 19,
        name: 'instalación de office',
        type: 1,
        color: '#7f8c8d'
      },
      {
        id: 20,
        name: 'reparación de pc',
        type: 1,
        color: '#7f8c8d'
      },
      {
        id: 21,
        name: 'paquete adobe',
        type: 1,
        color: '#7f8c8d'
      },
      {
        id: 22,
        name: 'gasista matriculado',
        type: 1,
        color: '#7f8c8d'
      }
    ]
    this.setState({ categories });


    const suggested = [
      {
        title: 'Casa',
        data: categories.slice(0, 6),
      },
      {
        title: 'Autos y Motos',
        data: categories.slice(6, 12),
      },
      {
        title: 'Oficina',
        data: categories.slice(12, 20),
      }
    ];
    this.setState({ suggested });


  }




  render() {
    // const { currentUser } = firebase.auth();
    const { user } = this.props.auth;

    const { categories, suggested } = this.state;

    return (
      <SafeAreaView style={CommonStyles.safeAreaContainer}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>

          <View style={{ height: 30 }} />
          
          <Image
            source={require("../../assets/app_logo.png")}
            style={{ height: 100, width: 100, marginBottom: 10 }}
          />

          {user&&
          <Text style={{ fontSize: 22, marginBottom: 10 }}>
            Hola {user.name}!
          </Text>
          }

          <View style={{ height: 30 }} />
          
          <Text style={{ fontSize: 22, marginBottom: 10 }}>
            ¿Qué estás necesitando?
          </Text>
            
          <Autocomplete
              list={categories}
              renderListItem={(item) => this.renderListItem(item)}
              startSuggestingFrom={2}
              inputStyle={styles.searchInput}
              suggestBoxStyle={styles.suggestBox}
              suggestBoxMaxHeight={220}
              placeholder="plomero, destapar baño, .."
          />

          <View style={{ height: 30 }} />
          
          <SectionGrid
            itemDimension={150}
            // staticDimension={300}
            // fixed
            // spacing={20}
            sections={suggested}
            style={styles.gridView}
            renderItem={({ item, section, index }) => (

              <TouchableOpacity
                accessibilityLabel={item.name}
                accessibilityRole="button"                
                key={index}                
                onPress={this.onCategoryClick.bind(this, item)}
              >
                <View style={[styles.itemContainer, { backgroundColor: item.color }]}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemCode}>{item.color}</Text>
                </View>
              </TouchableOpacity>
            )}
            renderSectionHeader={({ section }) => (
              <Text style={styles.sectionHeader}>{section.title}</Text>
            )}
          />

        </View>
      </SafeAreaView>
    );
  }
}

// const mapStateToProps = state => {
//   return {
//     auth: state.auth,
//     request: state.request
//   };
// };
// export default connect(mapStateToProps)(Home);



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
)(Home);




const styles = StyleSheet.create({
  normalText: {
    fontSize: 15,
    marginBottom: 5
  },
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
  sectionHeader: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    alignItems: 'center',
    backgroundColor: '#cccccc',
    color: 'white',
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 14
  },
})