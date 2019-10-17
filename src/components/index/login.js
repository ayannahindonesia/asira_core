import React from 'react'
import Logo from './../../support/img/logo.jpeg'
import './../../support/css/login.css'
import Loader from 'react-loader-spinner'
import swal from 'sweetalert'
import {Redirect} from 'react-router-dom'
import {keepLogin} from './../../1.actions'
import {connect} from 'react-redux'
import { postAdminLoginFunction, getTokenGeoFunction, getUserProfileFunction} from './saga'
import { getRoleFunction, getPermissionFunction } from '../rolePermission/saga';
import SecureLS from 'secure-ls';
import md5 from 'md5';

class Login extends React.Component{
    _isMounted = false;

    state = {
        token:"",
        authData:[],
        loading:false,
        tokenClient:'' , 
        isLogin : false
    }
  
    componentDidMount(){
        this._isMounted = true;
        console.log('login');
    }

    componentWillUnmount() {
        this._isMounted = false;     
    }

      
    //LOGIN BUTTON
    btnLogin = ()=>{
        this.setState({loading:true})
     
        const key=this.refs.username.value
        const password=this.refs.password.value
       
        if (key==="" || password===""){
            swal("Error","Username and Password Empty","error")
            this.setState({loading:false})

        } else {            
            const logindata ={key,password};

            this.postLoginAdmin(logindata)
        }
      
    } 

    postLoginAdmin = async function(param)  {
        const data = await postAdminLoginFunction(param, getTokenGeoFunction, getUserProfileFunction, getRoleFunction, getPermissionFunction)
        
        if(data) {
            if(!data.error) {
                let flag = false;
                let userPermission = [];
                
                if(data.dataRole && data.dataRole.status && data.dataPermission) {
                    for(const key in data.dataPermission) {
                        if(data.dataPermission[key].permissions) {
                            userPermission.push(data.dataPermission[key].permissions)
                        }                      
                    }

                    if(data.dataRole.system && data.dataRole.system.toString().toLowerCase() === 'core') {
                        flag = true;
                    }

                }
                
                const newLs = new SecureLS({encodingType: 'aes', isCompression: true, encryptionSecret:'react-secret'});    
                

                newLs.set(md5('profileUser'), JSON.stringify(userPermission));

                if(data.dataToken) {
                    newLs.set(md5('token'), data.dataToken);
                }
                if(data.dataGeoToken) {
                    newLs.set(md5('tokenGeo'), data.dataGeoToken);
                }
                

                this.setState({loading: false, isLogin: flag})
            } else {
                this.setState({loading : false})
                swal("Warning",data.error,"info")
            }
        }
    
    }

    renderBtnOrLoading =()=>{
        if (this.state.loading){
            return ( 
            <Loader 
                type="Circles"
                color="#00BFFF"
                height="30"	
                width="30"
            />);
           
        }
        else{
            return(
                <input type="button" className="loginBtn" onClick={this.btnLogin} style={{marginTop:"20px"}}  value="Sign in"/> 
            )
        }
    }

    render(){
        if(this.state.isLogin){
            return(
                <Redirect to='/' />
            )
        }

        return (
            <div className="App loginContainer mr-3">
                <div className="row">
                    <div className="col-6 col-md-6 mt-3">
                        <h2>Core</h2> 
                    </div>
                    <div className="col-6 col-md-6 mt-3">
                        <img src={Logo} alt="logo" width="60%"></img>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 col-md-12">
                        <hr/>
                        <h3>Sign In</h3>
                        <input type="text" placeholder="Username" ref="username" className="form-control"/>
                        <input type="password" placeholder="Password" ref="password" className="form-control"/>
                        {this.renderBtnOrLoading()}
                        <p style={{marginTop:"20px"}}>Forgot your password?</p>
                    
                    </div>
                </div>
            </div>
        )

    }
      
       
    
}

export default connect(null,{keepLogin}) (Login);
