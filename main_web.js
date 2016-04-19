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
  Platform,
  BackAndroid
} from 'react-native';

import ViewPager from './node_modules/react-native-viewpager'
import Web from './web_view';
import Me from './me';

var md5 = require('md5');
var Dimensions = require('Dimensions');

var iconUrlRow=new Array();

class MainWeb extends Component {
	constructor(props) {
	    super(props);   //这一句不能省略，照抄即可
	    this.state = {
        urlType: 1,
        urlData: null,
        iconData: null,
        userName:'',
        password:'',
        phoneNum: '0',
        emailStr: '',
        token: '',
        userId: '',
        key:'',
        isNext:false,
        message:'111111',
	    };
	}
  componentDidMount() {
  }  
  fetchData() {
      var url = this.props.url+'listPictures?USERNAME='+this.state.userName+'&FKEY='+this.state.key+'&TOKEN='+this.state.token;
      fetch(url)
        .then((response) => response.json())
        .then((responseData) => {
          if(responseData!=undefined){
              if(responseData.errorCode!=undefined){
                if(responseData.errorCode=='00'){
                    this.setState({
                        message: responseData.errorCode,
                        urlData: responseData,
                    });
                }
              }
            }
        })
        .done();
    var iconUrl = this.props.url+'listOutput?USERNAME='+this.state.userName+'&FKEY='+this.state.key+'&TOKEN='+this.state.token;
    fetch(iconUrl)
    .then((response) => response.json())
    .then((responseData) => {
      if(responseData!=undefined){
          if(responseData.errorCode!=undefined){
            if(responseData.errorCode=='00'){
                this.setState({
                    iconData: responseData,
                });
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
      });  
      this.fetchData();
    }).catch( err => {
    })
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
  onBack(){
      this.props.func(3);
  }
  pushToWeb(urlType) {
    if (urlType>=iconUrlRow.length||iconUrlRow.length==0){
      return;
    }
    else if(iconUrlRow[urlType]=='1'||iconUrlRow[urlType]==''||iconUrlRow[urlType].length<3){
      return;
    }
    this.props.webFunc(iconUrlRow[urlType]);
  }
  pushToMe(){
      this.props.meFunc(6,4);
  }
  renderPage(
    data,
    pageID) {
    return (
      <View style={styles.page}>
        <Text style={styles.text}>{data1}</Text>
      </View>
    )
  }
  render(){
    var row=[];
    var idRow=[0,1,2];
    var dataSource = new ViewPager.DataSource({
        pageHasChanged: (p1, p2) => p1 !== p2,
    });
    var cnt=0;
    if(this.state.urlData!==null){
      this.state.urlData.LIST.forEach(function(path) {
        row.push(path.PATH);
        idRow[cnt]=cnt;
        cnt=cnt+1;
      })
    }
    var iconRow=new Array();
    var iconTitleRow = new Array();
    if(this.state.iconData!==null){
      this.state.iconData.LIST.forEach(function(path) {
        iconRow.push(path.PATH);
        iconUrlRow.push(path.URL);
        iconTitleRow.push(path.NAME);
      })
    }
    return (
      <View style={styles.container}>
        <View style={styles.topView}>
              <TouchableOpacity onPress={()=>this.onBack()} style={styles.backBtn}>
                  <Image source={require('./res/back.png')} style={styles.backImage} />
                  <Text style={styles.backText}>返回</Text>
              </TouchableOpacity>
              <View style={{width:Dimensions.get('window').width-140, height:60, justifyContent: 'center',alignItems: 'center',}}>
                  <Text style={styles.topText}>掌上绍兴供销</Text>
              </View>
        </View>
        <ScrollView style={styles.scrollView}>
          <ViewPager
            style={this.props.style}
            dataSource={dataSource.cloneWithPages(idRow)}
            renderPage={function(data:Object,pageID:number|string,){return (
                <Image source={{uri:row[data]}} style={styles.swiperImage} />
            )}}
            isLoop={true}
            autoPlay={true}>
            </ViewPager>
            <View style={styles.midView}>
              <View style={styles.midViewItem}>
                <TouchableOpacity onPress={()=>this.pushToWeb(0)} style={styles.midBtn}>
                    <Image source={{uri:iconRow[0]}} style={styles.midImage} />
                    <Text style={styles.midText}>{iconTitleRow[0]}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.midViewItem}>
                <TouchableOpacity onPress={()=>this.pushToWeb(1)} style={styles.midBtn}>
                    <Image source={{uri:iconRow[1]}} style={styles.midImage} />
                    <Text style={styles.midText}>{iconTitleRow[1]}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.midViewItem}>
                <TouchableOpacity onPress={()=>this.pushToWeb(2)} style={styles.midBtn}>
                    <Image source={{uri:iconRow[2]}} style={styles.midImage} />
                    <Text style={styles.midText}>{iconTitleRow[2]}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.midView}>
              <View style={styles.midViewItem}>
                <TouchableOpacity onPress={()=>this.pushToWeb(3)} style={styles.midBtn}>
                    <Image source={{uri:iconRow[3]}} style={styles.midImage} />
                    <Text style={styles.midText}>{iconTitleRow[3]}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.midViewItem}>
                <TouchableOpacity onPress={()=>this.pushToWeb(4)} style={styles.midBtn}>
                    <Image source={{uri:iconRow[4]}} style={styles.midImage} />
                    <Text style={styles.midText}>{iconTitleRow[4]}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.midViewItem}>
                <TouchableOpacity onPress={()=>this.pushToWeb(5)} style={styles.midBtn}>
                    <Image source={{uri:iconRow[5]}} style={styles.midImage} />
                    <Text style={styles.midText}>{iconTitleRow[5]}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.midView}>
              <View style={styles.midViewItem}>
                <TouchableOpacity onPress={()=>this.pushToWeb(6)} style={styles.midBtn}>
                    <Image source={{uri:iconRow[6]}} style={styles.midImage} />
                    <Text style={styles.midText}>{iconTitleRow[6]}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.midViewItem}>
                <TouchableOpacity onPress={()=>this.pushToWeb(7)} style={styles.midBtn}>
                    <Image source={{uri:iconRow[7]}} style={styles.midImage} />
                    <Text style={styles.midText}>{iconTitleRow[7]}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.midViewItem}>
                <TouchableOpacity onPress={()=>this.pushToWeb(8)} style={styles.midBtn}>
                    <Image source={{uri:iconRow[8]}} style={styles.midImage} />
                    <Text style={styles.midText}>{iconTitleRow[8]}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Image source={require('./res/home3.png')} style={styles.midBottomImage} />
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
  topText: {
    fontSize: 20,
    color: 'white',  
    justifyContent: 'center', 
    alignItems: 'center',   
  },
  wrapper: {
    flex: 1, 
  },
  swiperImage: {
    width: Dimensions.get('window').width,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  midView:{
    width: Dimensions.get('window').width,
    height: 100,
    marginTop: 0.5,
    flexDirection: 'row',
    backgroundColor:'white',
  },
  midViewItem:{
    flex: 1, 
    justifyContent: 'center',
    borderColor:'#ececec',
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    backgroundColor:'white',
  },
  midBtn: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',  
    padding: 15,
    backgroundColor:'white',
  },
  midImage: {
    flex:0.5,
    width: 40,
    height: 40,
  },
  midText: {
    flex:0.5,
    fontSize: 15,
    color: '#9c9da2',  
    marginTop:5,
  },
  midBottomImage: {
    width: Dimensions.get('window').width,
    height: 60,
    marginTop:10,
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
    marginTop: 10,
    justifyContent: 'center', 
    alignItems: 'center',
  }, 
});

module.exports = MainWeb;