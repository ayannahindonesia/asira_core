import React from 'react'
import Logo from './../../support/img/logo.jpeg'
import './../../support/css/login.css'
import { Redirect  } from 'react-router-dom'
import swal from 'sweetalert'
import { changePasswordFunction } from './saga'

class changePassword extends React.Component{
    state = {
        loading:false,
        errorMessage:'',
        diKlik:false
    }
    componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }
    btnChangePassword = ()=>{   
    this.setState({loading:true})

    const password1 = this.refs.password1.value
    const password2 = this.refs.password2.value

    if(password1.toLowerCase() !== password2.toLowerCase()){
        this.setState({errorMessage:"Password tidak sesuai - Harap periksa kembali",loading:false})
    }else if(password1.trim()==='' || password2.trim()===''){
        this.setState({errorMessage:"Field ada yang kosong - Harap periksa kembali",loading:false})
    }else{
        const arr =  window.location.href.split("?")
        if (arr.length>1){
            const token = arr[1].slice(arr[1].indexOf('=')+1,arr[1].length)
            const param = {
                token,
                password:password1
            }
    
            this.changePass(param)
        }else{
           this.setState({errorMessage:"Token kosong/ Invalid - Harap Periksa Kembali"})
        }

        }

    }

     changePass = async function (param){
         const data = await changePasswordFunction (param)
         if(data){
             if(!data.error){
                swal("Berhasil","Password berhasil dirubah","success")
                this.setState({errorMessage:null,diKlik:true})
             }else{
                this.setState({errorMessage:"Terjadi Kesalahan - Harap Periksa Kembali"})

             }
         }

     }
    renderBtnOrLoading =()=>{
        if (this.state.loading){
            return ( 
                <input type="button" className="loginBtn" style={{marginTop:"20px",cursor:"wait"}}  value="..."/> 
            );
        }
        else{
            return(
                <input type="button" className="loginBtn" onClick={this.btnChangePassword} style={{marginTop:"20px"}}  value="Ubah Password"/> 
            )
        }
    }

    render(){
        if(this.state.diKlik){
            return <Redirect to='/'/>            
        }
        return(
            <div className="App mr-3 loginContainer">
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
                        <h3>Ubah Password</h3>
                        <div style={{color:"red",fontSize:"10px"}}>
                            {this.state.errorMessage}
                        </div>
                        <input type="password" placeholder="Password baru" ref="password1" className="form-control"/>
                        <input type="password" placeholder="Ulang password baru" ref="password2" className="form-control"/>
                        {this.renderBtnOrLoading()} 
                    </div>
                </div>
            </div>
        )
    }
}

export default changePassword;