'use strict';

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  TouchableOpacity,
  WebView,
  Animated,
  Easing,
  Platform,
  BackAndroid
} from 'react-native';

import Info from './info';
import Change from './change';
import Advice from './advice';
import Login from './login';
import Main from './main';

var md5 = require('md5');
var Dimensions = require('Dimensions');

class Me extends Component {
	  constructor(props) {  
        super(props);  
        this.state ={
          userName:'',
          password:'',
          phoneNum: '0',
          emailStr: '',
          token: '',
          userId: '',
          message:'',
          key:'',
          isNext:false,
          opacity: new Animated.Value(0)
        };
    } 
    componentDidMount() {
      global.storage.load({
        key: 'userDate',
        id: '1001',
        autoSync: true,
        syncInBackground: true
      }).then(ret => {
        this.setState({  
          userName:ret.userName,
          password:ret.password,
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
    callLogout(){    
        var url = this.props.url+'logout?USERNAME='+this.state.userName+'&FKEY='+this.state.key+'&TOKEN='+this.state.token
         fetch(url)
          .then((response) => response.json())
          .then((responseData) => {
            if(responseData!=undefined){
              if(responseData.errorCode!=undefined){
                if(responseData.errorCode=='00'){
                    this.setState({
                      message:'退出成功',
                    });        
                    global.storage.save({
                      key: 'userDate', 
                      id: '1001', 
                      rawData: { 
                        userName: this.state.userName,
                        password: this.state.password,
                        phoneNum: '',
                        emailStr: '',
                        token: '',
                        userId: '',
                        name:'',
                        sex:'',
                        bz:'',
                        address:'',
                        appKey:'',
                      },
                      expires: null
                    });
                    global.hasLogin = false;
                    this.onLogout();
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
    return true;
  }
	  onBack(){
      this.props.func(3);
	  }
    pushToContacts(){
      this.props.func(10);
    }
    onLogout(){
        this.props.func(1);
    }
    pushToInfo(){
        this.props.func(7);
    }
    pushToChange(){
        this.props.func(8);
    }
    pushToAdvice(){
        this.props.func(9);
    }
    pushToMessage(){
        this.props.func(11);
    }
    onCheck(){     
          this.setState({
            message:'暂无更新',
          });     
          this.showAlert();
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
	  	var myDate = new Date();
  		var y = myDate.getFullYear();  
  		var m = myDate.getMonth()+1;    
  		var d = myDate.getDate();        
  		var week = myDate.getDay();     
  		var weekStr;
  		if(week==0){
  			weekStr='星期天';
  		}
  		else if(week==1){
  			weekStr='星期一';
  		}
  		else if(week==2){
  			weekStr='星期二';
  		}
  		else if(week==3){
  			weekStr='星期三';
  		}
  		else if(week==4){
  			weekStr='星期四';
  		}
  		else if(week==5){
  			weekStr='星期五';
  		}
  		else if(week==6){
  			weekStr='星期六';
  		}
      var _this = this;
	    return (
	      <View style={styles.container}>
	        <View style={styles.topView}>
	        	<Image source={require('./res/user.jpg')} style={styles.headView} />
	        	<View style={styles.infoView}>
                	<Text style={styles.numText}>{this.state.userName}</Text>
                	<Text style={styles.dayText}>{y+'年'+m+'月'+d+'日'+weekStr}</Text>
	        	</View>
	        </View>
	        <View style={styles.midTopLine} />
	        <View style={styles.midView}>
	        	  <TouchableOpacity onPress={()=>this.pushToInfo()} style={styles.infoBtn}>
	                  <Image source={require('./res/icon1.png')} style={styles.icon} />
                	  <Text style={styles.infoText}>个人资料</Text>
	              </TouchableOpacity>
	        	  <TouchableOpacity onPress={()=>this.pushToChange()} style={styles.otherBtn}>
	                  <Image source={require('./res/icon2.png')} style={styles.icon} />
                	  <Text style={styles.infoText}>修改密码</Text>
	              </TouchableOpacity>
	        	  <View style={styles.midLine} />
	        	  <TouchableOpacity onPress={()=>this.pushToAdvice()} style={styles.otherBtn1}>
	                  <Image source={require('./res/icon3.png')} style={styles.icon} />
                	  <Text style={styles.infoText}>意见反馈</Text>
	              </TouchableOpacity>
	        	  <TouchableOpacity onPress={()=>this.callLogout()} style={styles.quitBtn}>
                	  <Text style={styles.quitText}>安全退出</Text>
	              </TouchableOpacity>
	        </View>
          <Animated.View style={[styles.alertView,{opacity: this.state.opacity}]}>
              <Text style={styles.alertText}>{this.state.message}</Text>
          </Animated.View>
	        <View style={styles.line} />
	        <View style={styles.toolBarView}>
	            <View style={styles.toolLeft}>
	                 <TouchableOpacity onPress={()=>this.onBack()} style={styles.leftBtn}>
	                  	<Image source={require('./res/left2.png')} style={styles.leftImage} />
	                 </TouchableOpacity>
	            </View>  
              <View style={styles.toolMid}>
                   <TouchableOpacity onPress={()=>this.pushToContacts()} style={styles.leftBtn}>
                      <Image source={require('./res/midleft_1.png')} style={styles.toolMidImage} />
                   </TouchableOpacity>
              </View>
              <View style={styles.toolMid}>
                   <TouchableOpacity onPress={()=>this.pushToMessage()} style={styles.leftBtn}>
                    <Image source={require('./res/midright_1.png')} style={styles.toolMidImage} />
                   </TouchableOpacity>
              </View> 
	            <View style={styles.toolLeft}>
	                  <Image source={require('./res/right1.png')} style={styles.rightImage} />
	            </View>
	        </View> 
	      </View>
	    );
	  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f6f5f5',
  }, 
  topView: {
  	width: Dimensions.get('window').width,
  	height: 120,
  	backgroundColor: '#20b0e8',  
  	flexDirection: 'row',
  	alignItems: 'center',  
  },  
  headView: {
  	width: 70,
  	height: 70,
  	alignItems: 'center', 
    marginLeft: 20,
    borderRadius:35,
  },
  numText: {
	fontSize: 15,
	color: 'white',
	marginLeft: 15,
	marginTop: 5,
  },
  dayText: {
	fontSize: 10,
	color: 'white',
	marginLeft: 15,
	marginTop: 5,
  },
  midView: {
  	flex: 1,
  },
  infoBtn: {
  	width: Dimensions.get('window').width,
  	height: 50,
  	backgroundColor: 'white',
  	marginTop: 10,
    alignItems: 'center', 
  	flexDirection: 'row',
  },
  otherBtn:{
  	width: Dimensions.get('window').width,
  	height: 50,
  	backgroundColor: 'white',
    alignItems: 'center', 
  	flexDirection: 'row',
    marginTop: 10,
  },
  otherBtn1:{
    width: Dimensions.get('window').width,
    height: 50,
    backgroundColor: 'white',
    alignItems: 'center', 
    flexDirection: 'row',
  },
  quitBtn: {
  	width: Dimensions.get('window').width-160,
  	height: 30,
  	backgroundColor: 'red',
    justifyContent: 'center', 
    alignItems: 'center', 
  	flexDirection: 'row',
  	marginLeft:80,
  	marginTop:30,
    borderRadius:5,
  },
  icon: {
  	width: 30,
  	height: 30,
    borderRadius: 15,
    marginLeft: 10,
  },
  infoText:{
	  fontSize: 20,
	  color: 'black',
    marginLeft: 10,
  },
  quitText:{
	   fontSize: 12,
	   color: 'white',
  },
  midTopLine: {
  	width: Dimensions.get('window').width,
  	height: 1,
  	backgroundColor: '#bdbdbd',
  	marginTop: 50,
  },
  midLine: {
  	width: Dimensions.get('window').width-10,
  	height: 1,
  	backgroundColor: '#bdbdbd',
  	marginLeft: 10,
  },
  toolBarView: {
  	width: Dimensions.get('window').width,
  	height: 60,
      justifyContent: 'center', 
      alignItems: 'center', 
  	flexDirection: 'row',
    backgroundColor: '#f4f4f4', 
  },
  alertView:{
      height:24,
      backgroundColor:'black',
      alignItems: 'center',
      justifyContent: 'center', 
      padding: 5,
      marginBottom: 10,
  },
  alertText:{
      fontSize: 14,  
      color: 'white',  
  },
  line: {
  	width: Dimensions.get('window').width,
  	height: 1,
    backgroundColor: '#bdbdbd', 
  },
  toolLeft: {
  	flex:1,
    alignItems: 'center',
  },
  leftBtn: {
  	flex:1,
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  leftImage: {
  	width: 70,
  	height: 40,
  	marginTop:10,
    alignItems: 'center', 
  },
  rightImage: {
  	width: 42,
  	height: 42,
  	marginTop:10,
    alignItems: 'center', 
  },
  leftText: {
    fontSize: 12,
    color: '#0075fc',  
    marginTop:2,
  },
  toolMid: {
  	flex:1,
    alignItems: 'center',
  },
  toolMidImage: {
  	width: 42,
  	height: 42,
    marginTop: 10,
    justifyContent: 'center', 
    alignItems: 'center',
  },
});

module.exports = Me;