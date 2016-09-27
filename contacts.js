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
  BackAndroid,
  Animated,
} from 'react-native';

var md5 = require('md5');
var Dimensions = require('Dimensions');
var _this = null;

class Contacts extends Component {
	constructor(props) {
	    super(props);  
	    this.state = {
        userName: '',
        token: '',
        key:'',
        pageNO:1,
        pageSize:10,
        totalNO:1,
        message:"获取中...",
        page1:1,
        page2:2,
	      contactsData: null, 
        color1:"black",
        color2:"blue",
        opacity: 0,
        searchText:"",
        search:"",
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
    onBack(){
      if(this.state.opacity==1){
        this.setState({
          search:"",
          searchText:"",
          opacity:0,
          pageNO:1,
          page1:1,
          page2:2,
          totalNO:1,
          color1:"black",
          color2:"blue",
        });
        this.fetchData();
      }
    }
    pushToMain(){
        this.props.func(3);
    }
    pushToMe(){
        this.props.func(6);
    }
    pushToMessage(){
        this.props.func(11);
    }
    onFirstBtn(){
        this.setState({
          pageNO:1,
          page1:1,
          page2:2,
          color1:"black",
          color2:"blue",
        });
        this.fetchData();
    }
    onLastBtn(){
        this.setState({
          pageNO:this.state.totalNO,
          page1:this.state.totalNO>1?this.state.totalNO-1:1,
          page2:this.state.totalNO>1?this.state.totalNO:2,
          color1:"blue",
          color2:"black",
        });
        this.fetchData();
    }
    onNextBtn(){
        if(this.state.pageNO < this.state.totalNO){
          var isAdd = false
          if(this.state.pageNO%2==0){
            isAdd = true
          }
          this.setState({
            pageNO:this.state.pageNO+1,
            page1:isAdd?this.state.page1+2:this.state.page1,
            page2:isAdd?this.state.page2+2:this.state.page2,
            color1:isAdd?"black":"blue",
            color2:isAdd?"blue":"black",
          });
        }
        this.fetchData();
    }
    onBacKBtn(){
        if(this.state.pageNO > 1){
          var isAdd = false
          if(this.state.pageNO%2==1){
            isAdd = true
          }
          this.setState({
            pageNO:this.state.pageNO-1,
            page1:isAdd?this.state.page1-2:this.state.page1,
            page2:isAdd?this.state.page2-2:this.state.page2,
            color1:isAdd?"blue":"black",
            color2:isAdd?"black":"blue",
          });
        }
        this.fetchData();
    }
    onPage1(){
        this.setState({
          pageNO:this.state.page1,
          color1:"black",
          color2:"blue",
        });
        this.fetchData();
    }
    onPage2(){
        this.setState({
          pageNO:this.state.page2,
          color1:"blue",
          color2:"black",
        });
        this.fetchData();
    }
    onSearch(){
        this.setState({
          search:this.state.searchText,
          searchText:"",
          opacity:1,
          pageNO:1,
          page1:1,
          page2:2,
          totalNO:1,
          color1:"black",
          color2:"blue",
        });
        this.fetchData();
    }
    render(){
      if (this.state.contactsData!=null){
         if(this.state.contactsData.list&&this.state.contactsData.list.length>0){
              var pageRow = [];
              var cnt = 0;
              pageRow.push(
                <View style={styles.listline} key={cnt}/>
              );
              cnt = cnt + 1;
            this.state.contactsData.list.forEach(function(path) {
              pageRow.push(
                <View style={styles.listView} key={cnt}>
                  <Text style={styles.nameText}>{"姓名："+path.NAME}</Text>
                  <Text style={styles.numText}>{"号码："+path.PHONE}</Text>
                  <View style={styles.listline} />
                </View>
              );
              cnt = cnt + 1;
            })
            pageRow.push(
              <View style={styles.numBgView} key={cnt}>
                <View style={styles.numBgLine} />
                <View style={styles.numView} >
                    <View style={[styles.numLine,{marginLeft: 1}]} />
                    <TouchableOpacity onPress={()=>this.onFirstBtn()} style={styles.numBtn}>
                        <Text style={styles.title1}>首页</Text>
                    </TouchableOpacity>
                    <View style={styles.numLine} />
                    <TouchableOpacity onPress={()=>this.onBacKBtn()} style={styles.numBtn}>
                        <Text style={styles.title1}>上一页</Text>
                    </TouchableOpacity>
                    <View style={styles.numLine} />
                    <TouchableOpacity onPress={()=>this.onPage1()} style={styles.numBtn}>
                        <Text style={[styles.title2,{color:this.state.color1}]}>{this.state.page1}</Text>
                    </TouchableOpacity>
                    <View style={styles.numLine} />
                    <TouchableOpacity onPress={()=>this.onPage2()} style={styles.numBtn}>
                        <Text style={[styles.title3,{color:this.state.color2}]}>{this.state.page2}</Text>
                    </TouchableOpacity>
                    <View style={styles.numLine} />
                    <TouchableOpacity onPress={()=>this.onNextBtn()} style={styles.numBtn}>
                        <Text style={styles.title1}>下一页</Text>
                    </TouchableOpacity>
                    <View style={styles.numLine} />
                    <TouchableOpacity onPress={()=>this.onLastBtn()} style={styles.numBtn}>
                        <Text style={styles.title1}>尾页</Text>
                    </TouchableOpacity>
                    <View style={[styles.numLine,{marginRight: 1}]} />
                </View>
                <View style={styles.numBgLine} />
              </View>
            );
            return (
              <View style={styles.container}>
                <View style={styles.topView}>
                  <TouchableOpacity onPress={()=>this.onBack()} style={styles.backBtn}>
                      <Image source={require('./res/back.png')} style={[styles.backImage,{opacity:this.state.opacity}]} />
                      <Text style={[styles.backText,{opacity:this.state.opacity}]}>返回</Text>
                  </TouchableOpacity>
                  <View style={{width:Dimensions.get('window').width-140, height:60, justifyContent: 'center',alignItems: 'center',}}>
                      <Text style={styles.topText}>通讯录</Text>
                  </View>
                </View>
                <View style={styles.searchView}>
                  <TextInput style={styles.textinput} onChangeText={(text) => this.setState({searchText:text,})} secureTextEntry={true} placeholder='输入用户名称' value={this.state.searchText}>
                  </TextInput>
                  <TouchableOpacity onPress={()=>this.onSearch()} style={styles.searchBtn}>
                      <Text style={styles.searchTitle}>搜索</Text>
                  </TouchableOpacity>
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
                        <Image source={require('./res/midleft_1.png')} style={styles.toolMidImage} />
                  </View>
                  <View style={styles.toolMid}>
                      <TouchableOpacity onPress={()=>this.pushToMessage()} style={styles.leftBtn}>
                        <Image source={require('./res/midright_1.png')} style={styles.toolMidImage} />
                       </TouchableOpacity>
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
        else if(this.state.contactsData.list&&this.state.contactsData.list.length==0){   
          return (
              <View style={styles.container}> 
                <View style={styles.topView}>
                  <TouchableOpacity onPress={()=>this.onBack()} style={styles.backBtn}>
                      <Image source={require('./res/back.png')} style={[styles.backImage,{opacity:this.state.opacity}]} />
                      <Text style={[styles.backText,{opacity:this.state.opacity}]}>返回</Text>
                  </TouchableOpacity>
                  <View style={{width:Dimensions.get('window').width-140, height:60, justifyContent: 'center',alignItems: 'center',}}>
                      <Text style={styles.topText}>通讯录</Text>
                  </View>
                </View>
                <View style={styles.searchView}>
                  <TextInput style={styles.textinput} onChangeText={(text) => this.setState({searchText:text,})} placeholder='输入用户名称' value={this.state.searchText}>
                  </TextInput>
                  <TouchableOpacity onPress={()=>this.onSearch()} style={styles.searchBtn}>
                      <Text style={styles.searchTitle}>搜索</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.errorView}>
                  <Text style={styles.errorText}>{this.state.message}</Text>
                </View>
                <View style={styles.line} />
                <View style={styles.toolBarView}>
                  <View style={styles.toolLeft}>
                       <TouchableOpacity onPress={()=>this.pushToMain()} style={styles.leftBtn}>
                          <Image source={require('./res/left2.png')} style={styles.leftImage} />
                       </TouchableOpacity>
                  </View> 
                  <View style={styles.toolMid}>
                        <Image source={require('./res/midleft_1.png')} style={styles.toolMidImage} />
                  </View>
                  <View style={styles.toolMid}>
                      <TouchableOpacity onPress={()=>this.pushToMessage()} style={styles.leftBtn}>
                        <Image source={require('./res/midright_1.png')} style={styles.toolMidImage} />
                      </TouchableOpacity>
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
      }
      else{      
        return (
            <View style={styles.container}> 
              <View style={styles.topView}>
                <TouchableOpacity onPress={()=>this.onBack()} style={styles.backBtn}>
                      <Image source={require('./res/back.png')} style={[styles.backImage,{opacity:this.state.opacity}]} />
                      <Text style={[styles.backText,{opacity:this.state.opacity}]}>返回</Text>
                </TouchableOpacity>
                <View style={{width:Dimensions.get('window').width-140, height:60, justifyContent: 'center',alignItems: 'center',}}>
                    <Text style={styles.topText}>通讯录</Text>
                </View>
              </View>
              <View style={styles.searchView}>
                <TextInput style={styles.textinput} onChangeText={(text) => this.setState({searchText:text,})} placeholder='输入用户名称' value={this.state.searchText}>
                </TextInput>
                <TouchableOpacity onPress={()=>this.onSearch()} style={styles.searchBtn}>
                    <Text style={styles.searchTitle}>搜索</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.errorView}>
                <Text style={styles.errorText}>{this.state.message}</Text>
              </View>
              <View style={styles.line} />
              <View style={styles.toolBarView}>
                <View style={styles.toolLeft}>
                     <TouchableOpacity onPress={()=>this.pushToMain()} style={styles.leftBtn}>
                        <Image source={require('./res/left2.png')} style={styles.leftImage} />
                     </TouchableOpacity>
                </View> 
                <View style={styles.toolMid}>
                      <Image source={require('./res/midleft_1.png')} style={styles.toolMidImage} />
                </View>
                <View style={styles.toolMid}>
                     <TouchableOpacity onPress={()=>this.pushToMessage()} style={styles.leftBtn}>
                      <Image source={require('./res/midright_1.png')} style={styles.toolMidImage} />
                     </TouchableOpacity>
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

module.exports = Contacts;