import React from 'react'
import Logo from './../../support/img/logo.jpeg'
import './../../support/css/login.css'
import Loader from 'react-loader-spinner'
import swal from 'sweetalert'
import {Redirect} from 'react-router-dom'
import { postAdminLoginFunction, getTokenGeoFunction, getUserProfileFunction,sendEmailFunction} from './saga'
import { setProfileUser } from './token'
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

class Login extends React.Component{
    _isMounted = false;

    state = {
        authData:[],
        loading:false,
        tokenClient:'' , 
        isLogin : false,
        open:false,
        email:'',
        error:'',
        loadMail:false,
    }
  
    componentDidMount(){
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;     
    }
    UNSAFE_componentWillReceiveProps(newProps){
        this.setState({error:newProps.error})
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

    //Forgot Password

    handleOpen = ()=>{
        this.setState({open:true})
    }
    handleClose = ()=>{
        this.setState({open:false})
    }
    handleEmail=(e)=>{
        this.setState({email:e.target.value})
        
    }
    handleSend=()=>{
        this.setState({loadMail:true})
        if(!(this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i))){
            this.setState({error:"Masukan format email yang benar",loadMail:false})
        }else{
            let newData = {
                email:this.state.email
            }
            this.sendEmail(newData)
        }
    }

    sendEmail = async function (params){
        const data = await sendEmailFunction (params)
        if(data){
            if(!data.error){
                swal("Email Terkirim",`Harap cek di ${this.state.email}`,"success")
                this.setState({error:'',open:false})
            }else{
                this.setState({error:data.error,loadMail:false})
            }
        }
    }

    renderBtnEmail =()=>{
        if(this.state.loadMail){
            return(
                <Button color="primary">
                    <Loader 
                    type="ThreeDots"
                    color="#00BFFF"
                    height="10"	
                    width="10"
                />   
                </Button>
            )
        }
        else{
            return(
                <Button onClick={this.handleSend} color="primary">
                    Kirim
                </Button>
            )
        }
    }
    

    postLoginAdmin = async function(param)  {
        const data = await postAdminLoginFunction(param, getTokenGeoFunction, getUserProfileFunction)
        
        if(data) {
            if(!data.error) {
                let flag = true;
                let userPermission = data.dataPermission || [];  
                
                setProfileUser(JSON.stringify(userPermission))

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

    renderBtnOrLoadingEmail =()=>{
        if (this.state.sendMail){
            return ( 
                <input type="button" className="btn btn-primary" disabled={true} style={{cursor:"progress"}} value="Kirim Email"/> 
            );
        }
        else{
            return(
                <input type="button" className="btn btn-primary" onClick={this.handleSend} value="Kirim Email"/> 
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
                 <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">Lupa Password? 
    <div style={{color:"red",fontSize:"10px"}}>
             {this.state.error}
    </div>
    </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Harap isi Email yang sudah terdaftar, Kami akan mengirimkan password anda disana.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            onChange={this.handleEmail}
            value={this.state.email}
            
          />
        </DialogContent>
        <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                     Cancel
                </Button>
                {this.renderBtnEmail()}
        </DialogActions>
      </Dialog>
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
                        <p style={{marginTop:"20px",cursor:"pointer"}} onClick={this.handleOpen}>Forgot your password?</p>
                    
                    </div>
                </div>
            </div>
        )

    }
      
       
    
}

export default (Login);
