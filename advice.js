'use strict';

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
  BackAndroid
} from 'react-native';

var md5 = require('md5');
var Dimensions = require('Dimensions');

class Advice extends Component {
    constructor(props) {  
        super(props);  
        this.state ={
          userName:'',
          password:'',
          phoneNum: '',
          emailStr: '',
          token: '',
          userId: '',
          message:'',
          key:'',
          adviceText:'',
          opacity: new Animated.Value(0),
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
          userName: ret.userName,
          password: ret.password,
          phoneNum: ret.phoneNum,
          emailStr: ret.emailStr,
          token: ret.token,
          userId: ret.userId,
        });  
      }).catch( err => {
      })
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
    }).start();
  }
    callAdvice(){    
      if(this.state.adviceText==''){
        this.setState({
          message:'请输入意见',
        });
        this.showAlert();
      }  
      else
      {
        var url = this.props.url+'updateQuestion?USERNAME='+this.state.userName+'&QDATA='+this.state.adviceText+'&FKEY='+this.state.key+'&TOKEN='+this.state.token
         fetch(url)
          .then((response) => response.json())
          .then((responseData) => {
            if(responseData!=undefined){
              if(responseData.errorCode!=undefined){
                      this.setState({
                        adviceText:'',
                      });      
                if(responseData.errorCode=='00'){
                      this.setState({
                        message:"提交成功",
                      });      
                    this.showAlert();
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
  onBack(){
      this.props.func(6);
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
    this.onBack(); 
    return true; 
  }
  render(){
    return (
      <View style={{flex:1,
        alignItems: 'center',
        backgroundColor: '#f6f5f5',}}>
        <View style={styles.topView}>
              <TouchableOpacity onPress={()=>this.onBack()} style={styles.backBtn}>
                  <Image source={require('./res/back.png')} style={styles.backImage} />
                  <Text style={styles.backText}>返回</Text>
              </TouchableOpacity>
        </View>       
        <TextInput style={styles.textinput} multiline={true} onChangeText={(text) => this.setState({adviceText:text,})} placeholder='提交意见' value={this.state.adviceText}>
        </TextInput>
        <TouchableOpacity onPress={()=>this.callAdvice()} style={styles.btn}>
            <Text style={styles.btnText}>提交意见</Text>
	      </TouchableOpacity>
        <Animated.View style={[styles.alertView,{opacity: this.state.opacity}]}>
            <Text style={styles.alertText}>{this.state.message}</Text>
        </Animated.View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
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
    textView:{
      width: Dimensions.get('window').width-20,
      height: 50,
      backgroundColor: 'white', 
      borderRadius:5,
      marginLeft: 10,
      marginTop: 10,
      justifyContent: 'center',
    },
    infoText:{
	  fontSize: 18,
	  color: 'black',
      marginLeft: 5,
    },
	  textinput: {   
	  	  marginTop:10,
	      marginLeft: 10,
	      marginRight: 10,
	      fontSize: 16,  
        height:200,
	      backgroundColor: 'white',
        textAlignVertical: 'top',
	  },
  btn: {
  	width: Dimensions.get('window').width-160,
  	height: 30,
  	backgroundColor: 'green',
    justifyContent: 'center', 
    alignItems: 'center', 
  	flexDirection: 'row',
  	marginTop:30,
    borderRadius:5,
  },
  btnText:{
	   fontSize: 12,
	   color: 'white',
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
});

module.exports = Advice;