import React from 'react';
import {withRouter} from 'react-router-dom'
import axios from 'axios'
import {connect} from 'react-redux'
import {keepLogin} from './1.actions'
import './App.css';

import {serverUrl} from './components/url'
import Login from './components/index/login'
import { getToken, setTokenAuth, getProfileUser, getTokenAuth } from './components/index/token';
import ResponsiveDrawer from './components/subComponent/Drawer';

import { Grid } from '@material-ui/core';
import Loading from './components/subComponent/Loading';

class App extends React.Component {
  _isMounted = false;

  state = {
    loading : true , 
  }

  componentDidMount(){
    this._isMounted=true;
    this.getAuth()
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate () {
    if(!getTokenAuth()) {
      this.getAuth()
    }
  }

  getAuth = ()=>{
    var url =serverUrl+"clientauth"
    axios.get(url ,{
        auth : {
          username : 'reactkey',
          password : 'reactsecret'
        }
    }).then((res)=>{

        setTokenAuth(res.data.token);
        
        this.setState({loading : false})   
    }).catch((err)=>{
      setTimeout(function(){ alert("Coba reload halaman/ cek koneksi internet"); }, 5000);
    })
  }

  checkUbahPasswordLink= (path, token) => {
    let flag = false;

    if(path && token) {
      if(
        path.split('/')[1] && path.split('/')[1] === 'ubahpassword' &&
        token.split('token=')[1] && token.split('token=')[1].length !== 0
      ) {
        flag = true;
      }
    }
    return flag
  }

  render() {  
    
    if(this.state.loading){
      return(
        <Loading />
      )
    }

    return (
      <Grid container>
        {
          getToken() && getProfileUser() ?
          <ResponsiveDrawer /> :
          <Login />
        }
        
      </Grid>
      
    
    );
 
  }
}
  
const mapStateToProps = (state)=>{
  return {
      id : state.user.id

  }
}

export default withRouter(connect(mapStateToProps,{keepLogin}) (App));