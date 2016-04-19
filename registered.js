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
  Platform,
  BackAndroid
} from 'react-native';

var md5 = require('md5');
var Dimensions = require('Dimensions');
var showAni=null;
var hideAni=null;

class Registered extends Component {
    constructor(props) {  
        super(props);  
        this.state = {
          userName:'',
          password:'',
          key:'',
          confirmPassWord:'',
          userNameText:'',
          message:this.props.key,
          isSuccess:false,
          opacity: new Animated.Value(0),
        };
    } 
    configureScenceAndroid(){
      return Navigator.SceneConfigs.FadeAndroid;
    }
    onBack(){
        this.props.func(1);
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
    this.props.func(1); 
    return true; 
  }
  componentDidMount() {     
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
      showAni = Animated.timing(this.state.opacity, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear
      });
      hideAni = Animated.timing(this.state.opacity, {
          toValue: 0,
          duration: 3000,
          easing: Easing.linear
      });
  }
    callRegistered(){
      if(this.state.userName==''){
          this.setState({
            message:'请输入手机号码',
          });
          this.showAlert();
      }
      else if(isNaN(this.state.userName)){
          this.setState({
            message:'请输入手机号码',
          });
          this.showAlert();
      }
      else if(this.state.userName.length!=11){
          this.setState({
            message:'请输入11位手机号码',
          });
          this.showAlert();
      }
      else if(this.state.password==''){
          this.setState({
            message:'请输入密码',
          });
          this.showAlert();
      }
      else if(this.state.password!==this.state.confirmPassWord){
          this.setState({
            message:'2次密码不一致',
          });
          this.showAlert();
      }
      else{   
        var url = this.props.url+'register?USERNAME='+this.state.userName+'&PASSWORD='+this.state.password+'&FKEY='+this.state.key
         fetch(url)
          .then((response) => response.json())
          .then((responseData) => {
            if(responseData!=undefined){
              if(responseData.errorCode!=undefined){
                if(responseData.errorCode=='00'){
                      this.setState({
                        userNameText:this.state.userName,
                        message:'注册成功',
                        userName:'',
                        password:'',
                        confirmPassWord:'',
                        isSuccess:true,
                      });
                      global.storage.save({
                        key: 'userDate',  
                        id: '1001',
                        rawData: { 
                          userName: this.state.userNameText,
                          password: '',
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
                }
              }
            }
          })
          .done();
      }
    }
    showAlert(){
       showAni.start(() => this.hideAlert());
    }
    hideAlert(){
      hideAni.start(() => this.doFinishHide());
    }
    doFinishHide(){
      if(this.state.isSuccess){
        this.onBack();
      }
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
                  <TextInput style={styles.textinput} onChangeText={(text) => this.setState({userName:text,})} placeholder='手机号码' value={this.state.userName}>
                  </TextInput>
                  <TextInput style={styles.textinput} onChangeText={(text) => this.setState({password:text,})} secureTextEntry={true} placeholder='密码' value={this.state.password}>
                  </TextInput>
                  <TextInput style={styles.textinput} onChangeText={(text) => this.setState({confirmPassWord:text,})} secureTextEntry={true} placeholder='确认密码' value={this.state.confirmPassWord}>
                  </TextInput>
                  <TouchableOpacity onPress={()=>this.callRegistered()} style={styles.btn}>
                      <Text style={styles.btnText}>注 册</Text>
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
    width:Dimensions.get('window').width-20,
    height:50, 
      marginTop:10,
        marginLeft: 10,
        marginRight: 10,
        fontSize: 16,  
        backgroundColor: 'white',
    },
  btn: {
    width: Dimensions.get('window').width-160,
    height: 30,
    backgroundColor: 'red',
    justifyContent: 'center', 
    alignItems: 'center', 
    flexDirection: 'row',
    marginTop:30,
    borderRadius:5,
  },
  btnText:{
     fontSize: 14,
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

module.exports = Registered;