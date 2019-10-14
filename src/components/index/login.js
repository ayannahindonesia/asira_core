import React from 'react'
import Logo from './../../support/img/logo.jpeg'
import './../../support/css/login.css'
import Loader from 'react-loader-spinner'
import swal from 'sweetalert'
import {Redirect} from 'react-router-dom'
import {keepLogin} from './../../1.actions'
import {connect} from 'react-redux'
import { postAdminLoginFunction, getTokenGeoFunction, getUserProfileFunction} from './saga'

 
class Login extends React.Component{
    state={token:"",authData:[],loading:false,tokenClient:'' , isLogin : false}
  
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
        const data = await postAdminLoginFunction(param, getTokenGeoFunction, getUserProfileFunction)
        
        if(data) {
            if(!data.error) {
                this.setState({loading: false, isLogin: true})
            } else {
                this.setState({loading : false})
                swal("Warning","Username atau Password tidak benar","info")
            }
        }
        console.log(data)
    
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
        // alert('masuk')
       

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
