'use strict';

import React, {
  Component,
  StyleSheet,
  Image,
  View
} from 'react-native';

var Dimensions = require('Dimensions');
import Login from './login';

class Welcome extends Component {
    constructor(props) {  
        super(props);  
    } 
    pushToLogin(){
        const navigator = this.props.navigator;   
        if(navigator) {  
            navigator.push({  
                name: 'Login',  
                component: Login,  
            });  
        } 
    }
    componentDidMount() {
      this.timer = setTimeout(()=>this.pushToLogin(), 2000);
    }
    render(){
      return (
        <View style={styles.container}>
             <Image source={require('./res/login.jpg')} style={styles.bgimage}/>  
        </View>
      );
    }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },  
  bgimage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode:Image.resizeMode.cover,
  },  
})

module.exports = Welcome;