'use strict';

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  WebView,
  Platform,
  BackAndroid
} from 'react-native';

var Dimensions = require('Dimensions');
var WEBVIEW_REF = 'webview';

var WebViewAndroid = require('react-native-webview-android');

class Web extends Component {
    constructor(props) {  
        super(props);  
    } 
  onBack(){
      this.props.func(4);
  }
  componentWillMount() {
    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }
  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }
  onBackAndroid = () => {
    this.refs[WEBVIEW_REF].goBack();
    return true; 
  }
  goBack() {
    this.refs[WEBVIEW_REF].goBack();
  }
  render(){
    return (
      <View style={{flex:1}}>
        <View style={styles.topView}>
              <TouchableOpacity onPress={()=>this.goBack()} style={styles.backBtn}>
                  <Image source={require('./res/back.png')} style={styles.backImage} />
                  <Text style={styles.backText}>返回</Text>
              </TouchableOpacity>
              <View style={{width:Dimensions.get('window').width-140,}}/>
              <TouchableOpacity onPress={()=>this.onBack()} style={styles.mainBtn}>
                  <Text style={styles.mainText}>主页</Text>
              </TouchableOpacity>
        </View>      
      <WebViewAndroid
        ref="webview"
        javaScriptEnabled={true}
        geolocationEnabled={false}
        builtInZoomControls={true}
        url={this.props.webUrl}
        style={styles.webview_style} />
      </View>
    );
  }
}

var styles = StyleSheet.create({
    webview_style:{
      flex:1,
        backgroundColor:'white',
    },
    topView: {
      width: Dimensions.get('window').width,
      height: 60,
      backgroundColor: '#057afb',  
      flexDirection: 'row',
      alignItems: 'center',  
    },
    backBtn: {
      width: 70,
      height: 60,
      marginLeft: 0,
      justifyContent: 'center',
      alignItems: 'center',  
      flexDirection: 'row',
    },
    backImage: {
      width: 30,
      height: 30,
      justifyContent: 'center',
    },
    backText: {
      fontSize: 13,
      color: 'white',  
      justifyContent: 'center',
    },
  mainBtn:{
    width: 70,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',  
  },
  mainText:{
    fontSize: 13,
    color: 'white',  
    justifyContent: 'center',
  },
});

module.exports = Web;