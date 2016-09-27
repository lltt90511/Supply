'use strict';

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  Image,
  PixelRatio,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  BackAndroid,
  Animated,
} from 'react-native';

var md5 = require('md5');
var Dimensions = require('Dimensions');
var _this = null;

class Message extends Component {
	constructor(props) {
	    super(props);  
	    this.state = {
        userName: '',
        token: '',
        key:'',
        message:"暂无消息...",
        opacity:0,
	      contactsData: null, 
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
          token: ret.token,
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
      _this = this;
	}
	fetchData() {
      var url;
      if (this.state.search==""){
         url = this.props.url+'listUsers?USERNAME='+this.state.userName+'&FKEY='+this.state.key+'&TOKEN='+this.state.token+'&PAGENO='+this.state.pageNO+'&PAGESIZE='+this.state.pageSize;
      }
      else{
         url = this.props.url+'listUsers?USERNAME='+this.state.userName+'&FKEY='+this.state.key+'&TOKEN='+this.state.token+'&PAGENO='+this.state.pageNO+'&PAGESIZE='+this.state.pageSize+"&NAME="+this.state.search;
      }
      fetch(url)
        .then((response) => response.json())
        .then((responseData) => {
          if(responseData!=undefined){
              if(responseData.errorCode!=undefined){
                if(responseData.errorCode=='00'){
                    if(responseData.list&&responseData.list.length==0){
                      this.setState({
                          message: "搜索不到您要找的用户...",
                          contactsData: responseData,
                          totalNO: responseData.totalPage,
                      });
                    }
                    else{
                      if(_this.refs["ScrollView"] !== undefined && _this.refs["ScrollView"] !== null){
                        _this.refs["ScrollView"].scrollTo({x:0, y:0, animated:false});
                      }
                      this.setState({
                          contactsData: responseData,
                          totalNO: responseData.totalPage,
                      });
                    }
                }
                else {      
                    if(responseData.errorMsg!=undefined){
                      this.setState({
                        message:"获取失败："+responseData.errorMsg,
                      });
                    }
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
    pushToMain(){
        this.props.func(3);
    }
    pushToContacts(){
        this.props.func(10);
    }
    pushToMe(){
        this.props.func(6);
    }
    render(){
        var pageRow = [];
        pageRow.push(<Text style={styles.errorText} key={1}>{"  益农宝：咨询专家医生，为您解答种养殖过程碰到的系列疑难问题。"}</Text>);
        pageRow.push(<Text style={styles.errorText} key={2}>{"  智慧农资：购买种养殖过程中需要的农药，化肥，工具等农资。"}</Text>);
        pageRow.push(<Text style={styles.errorText} key={3}>{"  菜篮子信息：了解绍兴农贸市场行情及相关动态信息。"}</Text>);
        pageRow.push(<Text style={styles.errorText} key={4}>{"  粮油信息：掌握每周粮油价及相关动态信息。"}</Text>);
        pageRow.push(<Text style={styles.errorText} key={5}>{"  绍兴馆：汇集绍兴各区县市农特产品及工艺品。"}</Text>);
        pageRow.push(<Text style={styles.errorText} key={6}>{"  农技培训：了解供销社近期培训及以往培训总结经验信息。"}</Text>);
        pageRow.push(<Text style={styles.errorText} key={7}>{"  供销e家：展示销售绍兴各大酒类品牌及当地各种特色特产。"}</Text>);
        pageRow.push(<Text style={styles.errorText} key={8}>{"  1号店：展示销售绍兴各大酒类品牌及当地各种特色特产。"}</Text>);
        return (
            <View style={styles.container}> 
              <View style={styles.topView}>
                <TouchableOpacity onPress={()=>this.onBack()} style={styles.backBtn}>
                    <Image source={require('./res/back.png')} style={[styles.backImage,{opacity:this.state.opacity}]} />
                    <Text style={[styles.backText,{opacity:this.state.opacity}]}>返回</Text>
                </TouchableOpacity>
                <View style={{width:Dimensions.get('window').width-140, height:60, justifyContent: 'center',alignItems: 'center',}}>
                    <Text style={styles.topText}>说明</Text>
                </View>
              </View>
              <ScrollView ref="ScrollView" style={styles.scrollView} >
                  {pageRow}
              </ScrollView>
              <View style={styles.line} />
              <View style={styles.toolBarView}>
                <View style={styles.toolLeft}>
                     <TouchableOpacity onPress={()=>this.pushToMain()} style={styles.leftBtn}>
                        <Image source={require('./res/left2.png')} style={styles.leftImage} />
                     </TouchableOpacity>
                </View> 
                <View style={styles.toolMid}>
                     <TouchableOpacity onPress={()=>this.pushToContacts()} style={styles.leftBtn}>
                        <Image source={require('./res/midleft_1.png')} style={styles.toolMidImage} />
                     </TouchableOpacity>
                </View>
                <View style={styles.toolMid}>
                      <Image source={require('./res/midright_2.png')} style={styles.toolMidImage} />
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
    backgroundColor: '#f6f5f5',
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
    fontSize: 15,
    color: 'white',  
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,  
  },
  errorView:{
    flex:1,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  errorText:{
    marginTop: 10,
    fontSize: 20,
    color: 'black', 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  topView: {
    width: Dimensions.get('window').width,
    height: 60,
    backgroundColor: '#057afb',  
    flexDirection: 'row',
    alignItems: 'center',  
  },
  topText: {
    fontSize: 20,
    color: 'white',  
    marginTop: 10,  
    marginBottom: 10,  
  },
  searchView:{
    width:Dimensions.get('window').width,
    height:60, 
    justifyContent: 'center', 
    flexDirection: 'row',
  },
  searchTitle:{
    fontSize: 14, 
    color: 'white', 
  },
  textinput: {   
    width:Dimensions.get('window').width-80,
    height:50, 
    marginTop:5,
      marginLeft: 10,
      fontSize: 16,  
      borderRadius:5,
      backgroundColor: 'white',
  },
  searchBtn:{
    width:50,
    height:50, 
    marginTop:5,
      marginLeft: 10,
      marginRight: 10,
      backgroundColor: 'red',
    justifyContent: 'center', 
    alignItems: 'center',
    borderRadius:5,
  },
  listView:{
      width: Dimensions.get('window').width,
      height:80,
  },
  nameText:{
    width: Dimensions.get('window').width-20,
      height:30,
    fontSize: 18,
    color: 'black',
    marginLeft: 10,
    marginTop: 10,
  },
  numText:{
    width: Dimensions.get('window').width-20,
      height:30,
    fontSize: 18,
    color: 'black',
    marginLeft: 10,
  },
  listline: {
    width: Dimensions.get('window').width,
    height: 1,
    backgroundColor: '#bdbdbd',
    marginTop: 5, 
  },
  numBgView:{
    width: Dimensions.get('window').width,
    height: 32,
    marginTop: 5, 
  },
  numView:{
    width: Dimensions.get('window').width,
    height: 30, 
    flexDirection: 'row',
  },
  numBtn:{
    flex:1,
    alignItems: 'center',
    justifyContent: 'center', 
  },
  numLine:{
    width: 1,
    height: 30,
    backgroundColor: '#bdbdbd',
  },
  numBgLine:{
    width: Dimensions.get('window').width-2,
    height: 1,
    backgroundColor: '#bdbdbd',
  },
  title1:{
    fontSize: 16,
    color: "blue",  
  },
  title2:{
    fontSize: 16,  
  },
  title3:{
    fontSize: 16,  
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

module.exports = Message;