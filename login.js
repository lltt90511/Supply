'use strict';

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  TextInput,
  Image,
  View,
  TouchableOpacity,
  Navigator,
  Animated,
  Easing,
} from 'react-native';

import Main from './main';
import Registered from './registered';
import Storage from 'react-native-storage';

var md5 = require('md5');
var Dimensions = require('Dimensions');

class Login extends Component {
    constructor(props) {  
        super(props);  
        this.state = {
          userName:'',
          password:'',
          phoneNum: '',
          emailStr: '',
          token: '',
          userId: '',
          key:'',
          message:'',
          opacity: new Animated.Value(0),
          name:'',
          sex:'',
          bz:'',
          address:'',
        };
    } 
    componentDidMount() {
      global.storage.load({
        key: 'userDate',
        id: '1001',
        autoSync: true,
        syncInBackground: true
      }).then( ret => {
        this.setState({   
          userName:ret.userName,
          password:ret.password,
        }); 
      }).catch( err => {
      })  
    }
    callLogin(){   
      if(this.state.userName==''){
          this.setState({
            message:'请输入用户名',
          });
          this.showAlert();
      } 
      else if(this.state.password==''){
          this.setState({
            message:'请输入密码',
          });
          this.showAlert();
      }
      else{
        var myDate = new Date();
        var y = myDate.getFullYear();  
        var m = myDate.getMonth()+1;    
        if(m<10){
          m='0'+m;
        }
        var d = myDate.getDate(); 
        if(d<10){
          d='0'+d;
        }
        var day = y+m+d;
        this.setState({
            key:md5('USERNAME'+day+",sxmk,"),
          });
        var url = this.props.url+'checkUserInfo?USERNAME='+this.state.userName+'&PASSWORD='+this.state.password+'&FKEY='+this.state.key
         fetch(url)
          .then((response) => response.json())
          .then((responseData) => {
            if(responseData!=undefined){
              if(responseData.errorCode!=undefined){
                if(responseData.errorCode=='00'){
                    global.storage.save({
                      key: 'userDate',  
                      id: '1001',
                      rawData: { 
                        userName: responseData.USERNAME,
                        password: this.state.password,
                        phoneNum: responseData.PHONE,
                        emailStr: responseData.EMAIL,
                        token: responseData.TOKEN,
                        userId: responseData.USER_ID,
                        name:responseData.NAME,
                        sex:responseData.SEX,
                        bz:responseData.BZ,
                        address:responseData.ADDRESS,
                        appKey:responseData.appkey,
                      },
                      expires: null
                    });
                    this.props.func(3);
                    // this.showAlert();
                }
                else
                {      
                    if(responseData.errorMsg!=undefined){
                      this.setState({
                        message:responseData.errorMsg,
                      });
                    }
                    this.showAlert();
                }
              }
            }
          })
          .done();
         }
    }
    callRegistered(){
      this.props.func(2,1);
    }
    showAlert(){
        Animated.timing(this.state.opacity, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear
      }).start(() => this.hideAlert());
    }
    hideAlert(){
      Animated.timing(this.state.opacity, {
          toValue: 0,
          duration: 3000,
          easing: Easing.linear
      }).start()
    }
    render(){
      return (
           <View style={styles.container}>
            <View style={styles.topView}>
               <Image source={require('./res/login_top.png')} style={styles.topImage}/>  
            </View>
            <TextInput style={styles.textinput} onChangeText={(text) => this.setState({userName:text,})} placeholder='用户名' value={this.state.userName} />
            <View style={styles.lineView} />
            <TextInput style={styles.textinput} onChangeText={(text) => this.setState({password:text,})} secureTextEntry={true} placeholder='密码' value={this.state.password} />
            <View style={styles.loginView}>
                <TouchableOpacity onPress={()=>this.callLogin()}  style={ styles.loginBtn }>
                    <Text style={styles.logintext}>登 录</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.callRegistered()}  style={ styles.registeredBtn }>
                    <Text style={styles.logintext}>注 册</Text>
                </TouchableOpacity>
            </View>
            <Animated.View style={[styles.alertView,{opacity: this.state.opacity}]}>
                <Text style={styles.alertText}>{this.state.message}</Text>
            </Animated.View>
            <View style={styles.bottomView}>
                <Text style={styles.bottomtext}>用户至上 用心服务</Text>
            </View>
          </View>
      );
    }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ECEDF1',
  },  
  topView: {
    flex: 0.8,
    // width: Dimensions.get('window').width,
    // height: 200,
    backgroundColor: '#ECEDF1',  
    justifyContent: 'center', 
  },
  topImage: {
    width: 654/2,
    height: 217/2,  
    alignSelf: 'center' ,
  },
  textinput: {   
    width:Dimensions.get('window').width-20,
    height:50,
      marginLeft: 10,
      marginRight: 10,
      fontSize: 16,  
      backgroundColor: 'white',
  },
  lineView: {
      marginLeft: 10,
      marginRight: 10,
      height: 1,
      backgroundColor: '#ECEDF1',
  },
  loginView: {
      flex: 0.85,  
      backgroundColor: '#ECEDF1',
      alignItems: 'center',
  },
  loginBtn: {  
      width: Dimensions.get('window').width-20,  
      // marginLeft: 10,
      // marginRight: 10,  
      marginTop: 10,  
      height: 40,
      backgroundColor: '#017afd',
      alignItems: 'center',
  },
  registeredBtn: {  
      width: Dimensions.get('window').width-20,  
      // marginLeft: 10,
      // marginRight: 10,  
      marginTop: 10,  
      height: 40,
      backgroundColor: 'red',
      alignItems: 'center',
  },
  logintext: {  
      fontSize: 17,  
      color: '#FFFFFF',  
      marginTop: 10,  
      marginBottom: 10,  
  }, 
  alertView:{
      height:24,
      backgroundColor:'black',
      alignItems: 'center',
      justifyContent: 'center', 
      padding: 5,
      marginTop: 20,
  },
  alertText:{
      fontSize: 14,  
      color: 'white',  
  },
  bottomView: {
      flex: 0.15,  
      backgroundColor: '#ECEDF1',
      alignItems: 'center',
  },
  bottomtext: {
      fontSize: 17,  
      color: '#969696',  
      marginBottom: 10, 
  },
});

module.exports = Login;