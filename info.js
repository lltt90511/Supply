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

class Info extends Component {
    constructor(props) {  
        super(props);  
        this.state ={
          userName:'',
          password:'',
          phoneNum: '',
          emailStr: '',
          token: '',
          userId: '',
          key:'',
          name:'',
          sex:'',
          bz:'',
          address:'',
          appKey:'',
          message:'',
          opacity: new Animated.Value(0),
          lastName:'',
          lastSex:'',
          lastBZ:'',
          lastAddress:'',
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
          phoneNum: ret.phoneNum,
          emailStr: ret.emailStr,
          token: ret.token,
          userId: ret.userId,
          name: ret.name,
          sex: ret.sex,
          bz: ret.bz,
          address:ret.address,
          appKey:ret.appKey,
          lastName: ret.name,
          lastSex: ret.sex,
          lastBZ: ret.bz,
          lastAddress:ret.address,
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
  callUpdate(){   
	  	if(this.state.sex==undefined||this.state.sex==null){
	  		this.setState({sex:''});
	  	} 
	  	if(this.state.bz==undefined||this.state.bz==null){
	  		this.setState({bz:''});
	  	} 
	  	if(this.state.address==undefined||this.state.address==null){
	  		this.setState({address:''});
	  	}
  		var url = this.props.url+'updateUserInfo?USERNAME='+this.state.userName+'&PHONE='+this.state.phoneNum+'&SEX='+this.state.sex+'&NAME='+this.state.name+'&BZ='+this.state.bz+'&ADDRESS='+this.state.address+'&FKEY='+this.state.key+'&TOKEN='+this.state.token;	       
	       fetch(url)
	        .then((response) => response.json())
	        .then((responseData) => {
	          if(responseData!=undefined){
	            if(responseData.errorCode!=undefined){
	              if(responseData.errorCode=='00'){
	                    this.setState({
                          message:"修改成功",
                     	  lastName:this.state.name,
                     	  lastSex:this.state.sex,
                     	  lastBZ:this.state.bz,
                     	  lastAddress:this.state.address,
	                    });    
                    global.storage.save({
                      key: 'userDate', 
      				        id: '1001', 
                      rawData: { 
                        userName: this.state.userName,
                        password: this.state.password,
                        phoneNum: this.state.phoneNum,
                        emailStr: this.state.emailStr,
                        token: this.state.token,
                        userId: this.state.userId,
			            name:this.state.name,
			            sex:this.state.sex,
			            bz:this.state.bz,
			            address:this.state.address,
			            appKey:this.state.appKey,
                      },
                      expires: null
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
		                this.setState({
		                  name:this.state.lastName,
		                  sex:this.state.lastSex,
		                  bz:this.state.lastBZ,
		                  address:this.state.lastAddress,
		                });  
	              } 
	            }
	          }
	        })
	        .done();
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
        <View style={styles.textView}>
              <Text style={styles.infoText}>{'账号：'+this.state.userName}</Text>
        </View>
        <TextInput style={styles.infoTextInput} onChangeText={(text) => this.setState({name:text,})} placeholder='请输入真实姓名' value={this.state.name}/>
        <TextInput style={styles.infoTextInput} onChangeText={(text) => this.setState({sex:text,})} placeholder='请输入性别' value={this.state.sex}/>
        <TextInput style={styles.infoTextInput} onChangeText={(text) => this.setState({address:text,})} placeholder='请输入地址' value={this.state.address}/>
		<TextInput style={styles.infoTextInput1} multiline={true} onChangeText={(text) => this.setState({bz:text,})} placeholder='请输入个人说明' value={this.state.bz}/>
        <TouchableOpacity onPress={()=>this.callUpdate()} style={styles.btn}>
            <Text style={styles.btnText}>提交信息</Text>
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
      marginLeft: 5,
      marginTop: 10,
      justifyContent: 'center',
    },
    infoText:{
	  fontSize: 18,
	  color: 'black',
      marginLeft: 5,
    },
    infoTextInput:{
      width: Dimensions.get('window').width-20,
      height:50,
	  fontSize: 18,
	  color: 'black',
      marginLeft: 10,
      marginTop: 10,
	  backgroundColor: 'white',
    },
    infoTextInput1:{
      width: Dimensions.get('window').width-20,
	      marginLeft: 10,
	      fontSize: 18,  
      marginTop: 10,
        height:100,
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

module.exports = Info;