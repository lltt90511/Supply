'use strict';

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  TextInput,
  Image,
  PixelRatio,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Navigator,
  BackAndroid
} from 'react-native';

import MainWeb from './main_web';
import Me from './me';

var md5 = require('md5');
var Dimensions = require('Dimensions');
var REQUEST_URL = "https://api.thinkpage.cn/v3/weather/daily.json?"

class Main extends Component {
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
        appKey:'',
        strUrl:'',
	      weatherData: null, 
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
          appKey:ret.appKey,
        });  
        this.fetchData();
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
	fetchData() {
      var url = REQUEST_URL + "key=" + this.state.appKey + "&location=shaoxing&language=zh-Hans&unit=c&start=0&days=5"
          this.setState({
              strUrl: url,
          });
	    fetch(url)
	      .then((response) => response.json())
	      .then((responseData) => {
	        this.setState({
	          	weatherData: responseData,
	        });
	      })
	      .done();
	}
	configureScenceAndroid(route){
      return Navigator.SceneConfigs.FadeAndroid;
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
    pushToMainWeb(){
        this.props.func(4);
    }
    pushToMe(){
        this.props.meFunc(6,3);
    }
    render(){
      var weatherPic='http://120.76.75.77/weather/99.png';
      var weatherNum=0
  	  var weatherRow = [];
  	  var cnt = 0
  	  if(this.state==undefined)
  	  {
      	  weatherPic='http://120.76.75.77/weather/99.png';
  	  }
      else if (this.state.weatherData==undefined)
      {
      	  weatherPic='http://120.76.75.77/weather/99.png';
      }
      else if (this.state.weatherData.results==undefined)
      {
      	  weatherPic='http://120.76.75.77/weather/99.png';
      }
      else if (this.state.weatherData.results[0].daily==undefined)
      {
      	  weatherPic='http://120.76.75.77/weather/99.png';
      }
      else if (this.state.weatherData.results[0].daily[0].code_day==undefined)
      {
      	  weatherPic='http://120.76.75.77/weather/99.png';
      }
      else
      {
      	  weatherPic='http://120.76.75.77/weather/'+this.state.weatherData.results[0].daily[0].code_day+'.png';
      	  weatherNum=this.state.weatherData.results[0].daily[0].high
      	  this.state.weatherData.results[0].daily.forEach(function(daily){
	  	  	var spliterArr = daily.date.split("-");
	  	  	var y = spliterArr[0];
	  	  	var m = spliterArr[1];
	  	  	var d = spliterArr[2];
	  	  	var week = (d+2*m+3*(m+1)/5+y+y/4-y/100+y/400)%7;
	  	  	var weekStr=m+'/'+d;
	  	  	var otherWeatherNum=daily.high?daily.high:0;
	  	  	var otherWeatherPic;
		  	  if (daily.code_day==undefined)
	        {
	      	   otherWeatherPic='http://120.76.75.77/weather/99.png';
	        }
	        else
	        {
	           otherWeatherPic='http://120.76.75.77/weather/'+daily.code_day+'.png';
	  	    }
	  	  	// if(week==1){
	  	  	// 	weekStr='星期一';
	  	  	// } 
	  	  	// else if(week==2){
	  	  	// 	weekStr='星期二';
	  	  	// } 
	  	  	// else if(week==3){
	  	  	// 	weekStr='星期三';
	  	  	// } 
	  	  	// else if(week==4){
	  	  	// 	weekStr='星期四';
	  	  	// } 
	  	  	// else if(week==5){
	  	  	// 	weekStr='星期五';
	  	  	// } 
	  	  	// else if(week==6){
	  	  	// 	weekStr='星期六';
	  	  	// } 
	  	  	// else if(week==7){
	  	  	// 	weekStr='星期七';
	  	  	// } 
	  	  	if(cnt==0){
	  	  	  weatherRow.push(
	          	   <View style={styles.otherWeatherInfoView} key={cnt}>
	          	   		<Text style={styles.otherWeatherInfoText1}>{weekStr}</Text>
	          	   		<Image source={{uri:otherWeatherPic}} style={styles.otherWeatherImage} />
	          	   		<Text style={styles.otherWeatherInfoText2}>{otherWeatherNum+'℃'}</Text>
	          	   </View>);
	  	  	}
	  	  	else{
	  	  	  weatherRow.push(
	          	   <View style={styles.otherWeatherInfoView} key={cnt}>
	          	   		<Text style={styles.otherWeatherInfoText3}>{weekStr}</Text>
	          	   		<Image source={{uri:otherWeatherPic}} style={styles.otherWeatherImage} />
	          	   		<Text style={styles.otherWeatherInfoText4}>{otherWeatherNum+'℃'}</Text>
	          	   </View>);
	  	  	}
	  	  	cnt++;
	  	 })
  	  };
        return (
        	  <View style={styles.container}>
	          <View style={styles.topView}>
	               <Text style={styles.topText}>掌上绍兴供销</Text>
	          </View>
		      <ScrollView style={styles.scrollView}>
		          <View style={styles.weatherView}>
		          	   <View style={styles.weatherImageView}>
		          	   		<Image source={{uri:weatherPic}} style={styles.weatherImage} />
		          	   </View>
		          	   <View style={styles.weatherInfoView}>
		               		<Text style={styles.weatherNumText}>{weatherNum+'℃'}</Text>
		               		<Text style={styles.weatherPlaceText}>shaoxing</Text>
		          	   </View>
		          </View>
	      	      <View style={styles.otherWeatherView}>
	      	   		   {weatherRow}
	      	   	  </View>
	      	   	  <View style={styles.btnView}>
	      	   	  	   <TouchableOpacity onPress={()=>this.pushToMainWeb()} style={styles.btn}>
		          	   		<Image source={require('./res/home1.png')} style={styles.btnImage} />
		          	   </TouchableOpacity>
	      	   	  </View> 
	      	   	  <View style={styles.midView}>
	      	   	  	   <Image source={require('./res/home2.png')} style={styles.midImage} />  
	      	   	  </View>  
                <View style={styles.codeView}>
                    <Image source={require('./res/code.png')} style={styles.codeImage} />
                </View>  
		      </ScrollView>
	          <View style={styles.line} />
	  	   	  <View style={styles.toolBarView}>
		  	   	  <View style={styles.toolLeft}>
		  	   	  	   	<Image source={require('./res/left1.png')} style={styles.leftImage} />
		  	   	  </View> 
		  	   	  <View style={styles.toolMid}>
		  	   	  	   	<Image source={require('./res/midleft_1.png')} style={styles.toolMidImage} />
		  	   	  </View>
              <View style={styles.toolMid}>
                    <Image source={require('./res/midright_1.png')} style={styles.toolMidImage} />
              </View>  
		  	   	  <View style={styles.toolLeft}>
	      	   	  	   <TouchableOpacity onPress={()=>this.pushToMe()} style={styles.leftBtn}>
	      	   	  	   		<Image source={require('./res/right2.png')} style={styles.rightImage} />
		          	   </TouchableOpacity>
		  	   	  </View>
	  	   	  </View> 
	        </View>	
        );
    }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },  
  scrollView: {
    flex: 1,  
  },
  topView: {
    width: Dimensions.get('window').width,
    height: 60,
    backgroundColor: '#007afb',  
    justifyContent: 'center', 
    alignItems: 'center',
  },
  topText: {
    fontSize: 20,
    color: 'white',  
    marginTop: 10,  
    marginBottom: 10,  
  },
  weatherView: {
    width: Dimensions.get('window').width,
    height: 80,
    backgroundColor: '#0060c7',  
    // justifyContent: 'center',
  	flexDirection: 'row',
  },
  weatherImageView: {
	  flex:0.2,
	  backgroundColor: '#0060c7',
	  justifyContent: 'center',
	  alignItems: 'center',
  },
  weatherImage: {
	  width: 50, 
	  height: 50,
	  justifyContent: 'center', 
  },
  weatherInfoView: {
  	flex: 0.8,
    backgroundColor: '#0060c7',  
    justifyContent: 'center', 
    // // alignItems: 'center',
  },
  weatherNumText: {
    fontSize: 17,
    color: 'white',
    justifyContent: 'center',
  },
  weatherPlaceText: {
    fontSize: 12,
    color: 'white',   
    justifyContent: 'center', 
  },
  otherWeatherView: {
  	width: Dimensions.get('window').width,
    height: 60,
    backgroundColor: 'white',  
    // justifyContent: 'center',
  	flexDirection: 'row',
  },
  otherWeatherInfoView:{
  	flex:1,
    alignItems: 'center',
  },
  otherWeatherInfoText1: {
    fontSize: 10,
    color: '#4c4c4c',  
    marginTop:2,
    alignItems: 'center',
  },
  otherWeatherInfoText2: {
    fontSize: 8,
    color: '#4c4c4c',  
    marginTop:2,
    alignItems: 'center',
  },
  otherWeatherInfoText3: {
    fontSize: 10,
    color: '#979797',  
    marginTop:2,
    alignItems: 'center',
  },
  otherWeatherInfoText4: {
    fontSize: 8,
    color: '#979797',  
    marginTop:2,
    alignItems: 'center',
  },
  otherWeatherImage: {
	  width: 20, 
	  height: 20, 
      marginTop: 2,
      alignItems: 'center',  
  },
  btnView: {
  	width: Dimensions.get('window').width,
  	height: Dimensions.get('window').width,
      justifyContent: 'center', 
      alignItems: 'center',  
      marginTop:0,
  },
  btn: {  
  	width: Dimensions.get('window').width,
  	height: Dimensions.get('window').width,
      justifyContent: 'center', 
      alignItems: 'center', 
  },
  btnImage: {  
  	width: Dimensions.get('window').width,
  	height: Dimensions.get('window').width,
      justifyContent: 'center', 
      alignItems: 'center',  
    resizeMode:Image.resizeMode.cover,
  },
  midView: {
    width: Dimensions.get('window').width,
      justifyContent: 'center', 
      alignItems: 'center', 
  },
  midImage: {
    width: 550/1.6,
    height: 76/1.6,
  },
  codeView: {
  	width: Dimensions.get('window').width,
  	height: 300,
      justifyContent: 'center', 
      alignItems: 'center', 
  },
  codeImage: {
  	width: 300,
  	height: 300,
  },
  bottomView: {
  	width: Dimensions.get('window').width,
  	height: 60,
      justifyContent: 'center', 
      alignItems: 'center', 
  },
  bottomImage: {
  	width: Dimensions.get('window').width,
  	height: 60,
      justifyContent: 'center', 
      alignItems: 'center', 
  },
  line: {
  	width: Dimensions.get('window').width,
  	height: 1,
    backgroundColor: '#bdbdbd', 
  },
  toolBarView: {
  	width: Dimensions.get('window').width,
  	height: 60,
      justifyContent: 'center', 
      alignItems: 'center', 
  	flexDirection: 'row',
    backgroundColor: '#f4f4f4', 
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
    marginTop:10,
    alignItems: 'center',
  },
});

module.exports = Main;