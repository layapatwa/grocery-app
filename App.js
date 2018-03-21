import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  ReactNative,
  ListView
} from 'react-native';
import * as firebase from 'firebase';

const StatusBar = require('./components/StatusBar');
const ActionButton = require('./components/ActionButton');
const ListItem = require('./components/ListItem');
const styles = require('./styles.js');

const firebaseConfig = {
  apiKey: "AIzaSyATJxKl3IhraQVL_rciX0B0waXR3C6bZ90",
  authDomain: "my-grocery-app-8beb7.firebaseapp.com",
  databaseURL: "https://my-grocery-app-8beb7.firebaseio.com",
  storageBucket: "gs://my-grocery-app-8beb7.appspot.com"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

/*const firebaseConfig = {
  apiKey: "AIzaSyClxEJRyDIZfuRtL_Msrk7vT4dzBqED9CY",
  authDomain: "fir-app-6d975.firebaseapp.com",
  databaseURL: "https://fir-app-6d975.firebaseio.com",
  projectId: "fir-app-6d975",
  storageBucket: "",
  messagingSenderId: "1067237325552"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
*/

type Props = {};

export default class App extends Component<Props> {

  constructor(props){
    super(props);
    let ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})
    this.state = {
      newContact: "",
      itemDataSource: ds
    };
    this.itemsRef = this.getRef().child('items');
  }

  getRef(){
    return firebaseApp.database().ref();
  }

  getItems(itemsRef){
    //let items = ['Laya','Megha'];
    itemsRef.on('value',(snap)=>{
      let items = [];
      snap.forEach((child) => {
        items.push({
          title: child.val().item,
          _key: child.key
        });
      });
      this.setState({
        itemDataSource: this.state.itemDataSource.cloneWithRows(items)
      });
    });
  }

  componentDidMount() {
    this.getItems(this.itemsRef);
  }

  _renderItem(item) {

    const onPress = () => {
      Alert.alert(
        'Tap complete to delete',
        '',
        [
          {text: 'Complete', onPress: (text) => this.itemsRef.child(item._key).remove()},
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'}
        ],
        { cancelable: true }
      );
    };
    return (
      <ListItem item={item} onPress={onPress} />
    );
  }

  renderRow(item){
    return(
      <Text style={styles.liText}>{item.title}</Text>
    )
  }

  _addItem(item) {
  
  
  }
    

    render() {
    let pic = {
      uri: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg'
    };
    return (
      <View style={styles.container}>
      <StatusBar title="Grocery List" />
        <ListView 
          dataSource={this.state.itemDataSource}
          renderRow={this._renderItem.bind(this)}
          enableEmptySections={true}
          style={styles.li}

        />
        <ActionButton onPress={this._addItem.bind(this)} title="Add" />
        </View>
    );
  }
}