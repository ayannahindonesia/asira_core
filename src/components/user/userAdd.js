import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import Loader from 'react-loader-spinner'
import axios from 'axios'
import { serverUrl } from '../url';
import CheckBox from '@material-ui/core/Checkbox';
import DropDown from '../subComponent/DropDown';
import swal from 'sweetalert';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import { compose } from 'redux';
import { listAllRolePermission } from './../global/globalConstant'
import { getAllRoleFunction } from './../rolePermission/saga'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { constructRolePermission } from './function'

const styles = (theme) => ({
    container: {
      flexGrow: 1,
    },
    textField: {
      border: '1px solid',
    },
  });

const cookie = new Cookies();



class userAdd extends React.Component{
    _isMounted = false;

    state = {
      diKlik:false,
      errorMessage:'',
      listAllRolePermission,
      listRolePermission: [],
      disabled: false,
      role : 0,
      listRole: [],
      loading: true,
      status: true,
      username: '',
      phone:'',
      email:'',
    };

    componentDidMount(){
      this._isMounted = true;
      this.refresh()
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    refresh = async function(){
      const param = {
        status: true,
      };
      
      const data = await getAllRoleFunction(param);
      console.log(data)
      if(data) {
        if(!data.error) {
          this.setState({
            listRole: data.dataRole,
            role: (data.dataRole && data.dataRole[0] && data.dataRole[0].id) || 0,
            loading: false,
          })
        } else {
          this.setState({
            errorMessage: data.error,
            loading: false,
          })
        }      
      }
    }

    btnCancel = ()=>{
      this.setState({diKlik:true})
    }

    componentWillReceiveProps(newProps){
      this.setState({errorMessage:newProps.error})
    }

    btnSave=()=>{
      if (this.validate()) {
        const dataUser = {
          username : this.state.username,
          role_id : this.state.role,
          phone : this.state.phone,
          email : this.state.email,
          status : this.state.status,
        }

        this.setState({loading: true});
        
        const config = {
          headers: {'Authorization': "Bearer " + cookie.get('token')}
        };

        axios.post(serverUrl+'admin/users',dataUser,config).then((res)=>{
          swal("Success","User berhasil di tambah","success")
          this.setState({diKlik:true})
        }).catch((err)=>{
          this.setState({
            errorMessage : err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`,
          })
        })
      }
    }

    onChangeCheck = (e) => {
      this.setState({
        status: !this.state.status,
      });
    };

    onChangeTextField = (e) => {
      let value = e.target.value;
      let labelName = e.target.id;
      let flag = true;

      if(value.includes(' ') || value.includes('\'') || value.includes('"') || value.includes(',') ) {
        flag = false
      }

      if(labelName === 'phone' && isNaN(value)) {    
        flag = false 
      }
      
      if(flag) {
        this.setState({
          [labelName]: value,
        })
      } 
    }

    onChangeDropDown = (e) => {
      console.log(e.target.value)
      this.setState({role: e.target.value})
    }

    validateEmail = (email) => {
      let flag = false;

      if(email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
        flag = true;
      }

      return flag;
    }

    validatePhone = (phone) => {
      let flag = false;
      let phoneRegex = /^(^\+62\s?|^0)(\d{3,4}){2}\d{3,4}$/;

      if(phone.match(phoneRegex)) {
        console.log(phone.match(phoneRegex))
        flag = true
      }
      

      return flag;
    }

    validate = () => {
      let flag = true;
      let errorMessage = '';

      if (!this.state.username || this.state.username.length === 0) {
        flag = false;
        errorMessage = 'Mohon input nama akun dengan benar'
      } else if (!this.state.role || this.state.role === 0) {
        flag = false;
        errorMessage = 'Mohon input role dengan benar'
      } else if (
          !this.state.email || this.state.email.length === 0 || !this.validateEmail(this.state.email)
        ) {
        flag = false;
        errorMessage = 'Mohon input email dengan benar'
      } else if (!this.state.phone || this.state.phone.length === 0 || !this.validatePhone(this.state.phone)) {
        console.log(this.state.phone)
        flag = false;
        errorMessage = 'Mohon input kontak pic dengan benar'
      } else {
        console.log('bagus')
        errorMessage = ''
      }
         
      this.setState({
        errorMessage,
      })

      return flag;
    }

    render(){
        if(this.state.diKlik){
          return <Redirect to='/listUser'/>            
        } else if (this.state.loading){
          return  (
            <div key="zz">
              <div align="center" colSpan={6}>
                <Loader 
                  type="Circles"
                  color="#00BFFF"
                  height="40"	
                  width="40"
                />   
              </div>
            </div>
          )
        } else if(cookie.get('token')){
          return(
              <div className="container mt-4">
                <h3>Akun - Tambah</h3>
                                
                <hr/>
                
                <form>
                  <div className="form-group row">   
                    <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'left', marginBottom:'2vh'}}>
                      {this.state.errorMessage}
                    </div>    
                  </div>
                  <div className="form-group row" style={{marginBottom:20}}>                
                    <label className="col-sm-2 col-form-label" style={{height:3.5}}>
                      Nama Akun
                    </label>
                    <label className="col-sm-1 col-form-label" style={{height:3.5}}>
                      :
                    </label>
                    <div className="col-sm-4" >
                      <TextField
                        id="username"
                        onChange={this.onChangeTextField}
                        value={this.state.username}
                        hiddenLabel
                        fullWidth
                        placeholder="Nama Akun"
                        style={{border:'1px groove', paddingLeft:'5px'}}
                      />
                    </div>                 
                  </div>

                  <div className="form-group row" style={{marginBottom:20}}>                   
                    <label className="col-sm-2 col-form-label" style={{lineHeight:3.5}}>
                      Role
                    </label>
                    <label className="col-sm-1 col-form-label" style={{lineHeight:3.5}}>
                      :
                    </label>
                    <div className="col-sm-4">
                      <DropDown
                        value={this.state.role}
                        label="Role"
                        data={this.state.listRole}
                        id="id"
                        labelName="name"
                        onChange={this.onChangeDropDown}
                        fullWidth
                      />
                    </div>                 
                  </div>

                  <div className="form-group row" style={{marginBottom:40}}>                   
                    <label className="col-sm-2 col-form-label" style={{lineHeight:1.5}}>
                      Email
                    </label>
                    <label className="col-sm-1 col-form-label" style={{lineHeight:1.5}}>
                      :
                    </label>
                    <div className="col-sm-4">
                      <TextField
                        id="email"
                        type="email"
                        onChange={this.onChangeTextField}
                        value={this.state.email}
                        hiddenLabel
                        fullWidth
                        placeholder="Email"
                        style={{border:'1px groove', paddingLeft:'5px'}}
                      />
                    </div>                   
                  </div>

                  <div className="form-group row" style={{marginBottom:20}}>                   
                    <label className="col-sm-2 col-form-label" style={{lineHeight:1.5}}>
                      Kontak PIC
                    </label>
                    <label className="col-sm-1 col-form-label" style={{lineHeight:1.5}}>
                      :
                    </label>
                    <div className="col-sm-4">
                      <TextField
                        id="phone"
                        type="tel"
                        onChange={this.onChangeTextField}
                        value={this.state.phone}
                        hiddenLabel
                        fullWidth
                        placeholder="Telepon"
                        style={{border:'1px groove', paddingLeft:'5px'}}
                      />
                    </div>                   
                  </div>

                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label" style={{lineHeight:3.5}}>
                      Status
                    </label>
                    <label className="col-sm-1 col-form-label" style={{lineHeight:3.5}}>
                      :
                    </label>
                    <div className="col-4" style={{color:"black",fontSize:"15px",alignItems:'left', paddingTop: '15px'}}>
                      
                      <FormControlLabel
                        control={
                          <CheckBox       
                            color="default"           
                            onChange={this.onChangeCheck}
                            checked={this.state.status}
                            style={{justifyContent:'left'}}
                          />  
                        }
                        label={this.state.status ? "Aktif" : "Tidak Aktif"}
                      />
                      
                    </div>           
                  </div>
                  
                  <div className="form-group row">
                      <div className="col-sm-12 ml-3 mt-3">
                        <input type="button" value="Simpan" className="btn btn-success" onClick={this.btnSave} disabled={this.state.disabled}/>
                        <input type="button" value="Batal" className="btn ml-2" onClick={this.btnCancel} style={{backgroundColor:"grey",color:"white"}}/>
                      </div>
                  </div>
                  
                </form>
              
              </div>
          )
        } else if(!cookie.get('token')){
          return (
              <Redirect to='/login' />
          )    
        }
       
    }
}

export function mapDispatchToProps(dispatch) {
    return {
    //   getSourceTransaction: () => {
    //     dispatch(sourceTransactionRequest());
    //   handleRedirect: (route) => {
    //     dispatch(push(route));
    //   },
    };
}
  
export const mapStateToProps = createStructuredSelector({
  // user: getUserState(),
});

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps
);

const withStyle = withStyles(styles);

export default compose(
    withConnect,
    withStyle,
    withRouter
  )(userAdd);