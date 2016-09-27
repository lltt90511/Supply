/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Image,
  Navigator,
  View
} from 'react-native';

import Storage from 'react-native-storage';

import Welcome from './welcome';
import Login from './login';
import Registered from './registered';
import Main from './main';
import MainWeb from './main_web';
import Web from './web_view';
import Me from './me';
import Info from './info';
import Change from './change';
import Advice from './advice';
import Contacts from './contacts';
import Message from './message';

var REQUEST_URL = 'http://115.230.124.122:8080/sxmk/app/'
// var REQUEST_URL = 'http://120.76.75.77:8080/sxmk/app/'

var storage = new Storage({
  //最大容量，默认值1000条数据循环存储
  size: 1000,    

  //数据过期时间，默认一整天（1000 * 3600 * 24秒）
  defaultExpires: 1000 * 3600 * 24 * 1000,

  //读写时在内存中缓存数据。默认启用。
  enableCache: false,

  //如果storage中没有相应数据，或数据已过期，
  //则会调用相应的sync同步方法，无缝返回最新数据。
  sync : {
    //同步方法的具体说明会在后文提到
  }
})

global.storage = storage;

var _this;

class SupplyApp extends Component {
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
          name:'',
          sex:'',
          bz:'',
          address:'',
          curentPage:0,
          lastPage:0,
          webUrl:'',
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
        if(ret.token!==undefined&&ret.token!==null&&ret.token!==''){
          this.timer = setTimeout(()=>this.changePage(3), 2000);
        }
        else{
          this.timer = setTimeout(()=>this.changePage(1), 2000);
        }
      }).catch( err => {
          this.timer = setTimeout(()=>this.changePage(1), 2000);
      })  
      _this = this;
    }    
    changePage(page){
        _this.setState({curentPage:page});
    }  
    changeWebPage(url){
      _this.setState({webUrl:url,curentPage:5});
    }
    changeMePage(page,lpage){
        _this.setState({curentPage:page,lastPage:lpage});
    }
    render(){
      switch(this.state.curentPage){
        case 0:
          return(<Welcome />);
        case 1:
          return(<Login func={this.changePage} url={REQUEST_URL} />);
        case 2:
          return(<Registered func={this.changePage} url={REQUEST_URL}/>);
        case 3:
          return(<Main func={this.changePage} meFunc={this.changeMePage} url={REQUEST_URL}/>);
        case 4:
          return(<MainWeb func={this.changePage} meFunc={this.changeMePage} webFunc={this.changeWebPage} url={REQUEST_URL}/>);
        case 5:
          return(<Web func={this.changePage} url={REQUEST_URL} webUrl={this.state.webUrl}/>);
        case 6:
          return(<Me func={this.changePage} meFunc={this.changeMePage} url={REQUEST_URL} lastPage={this.state.lastPage}/>);
        case 7:
          return(<Info func={this.changePage} url={REQUEST_URL}/>);
        case 8:
          return(<Change func={this.changePage} url={REQUEST_URL}/>);
        case 9:
          return(<Advice func={this.changePage} url={REQUEST_URL}/>);
        case 10:
          return(<Contacts func={this.changePage} url={REQUEST_URL}/>);
        case 11:
          return(<Message func={this.changePage} url={REQUEST_URL}/>);
      }
    }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },  
  bgimage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },  
})

AppRegistry.registerComponent('SupplyApp', () => SupplyApp);
