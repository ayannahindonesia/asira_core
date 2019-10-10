import React from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import Loader from 'react-loader-spinner'
import swal from 'sweetalert';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/styles';
import { compose } from 'redux';
import CheckBox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import { getAllRoleFunction } from './../rolePermission/saga'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { getUserFunction, patchUserAddFunction } from './saga';
import { validateEmail, validatePhone } from '../global/globalFunction';
import DropDown from '../subComponent/DropDown';

const styles = (theme) => ({
    container: {
      flexGrow: 1,
    },
  });

const cookie = new Cookies();


class rolePermissionEdit extends React.Component{
    state = {
      diKlik:false,
      errorMessage:'',
      listRolePermission: [],
      listRole : {},
      username: '',
      password: '',
      email:'',
      phone:'',
      role: 0,
      userId: 0,
      loading: true,
      disabled:true,
    };

    componentDidMount(){
      this.setState({
        userId: this.props.match.params.id,
      },() => {
        this.refresh();
      })
    }

    refresh = async function(){
      const param = {
        status: true,
      };
      
      const paramUser = {
        userId: this.state.userId,
      };

      const data = await getAllRoleFunction(param);
      const dataUser = await getUserFunction(paramUser);

      if(data && dataUser) {
          if(!data.error && !dataUser.error) {
            this.setState({
              listRole: data.dataRole,
              role: (data.dataRole && data.dataRole[0] && data.dataRole[0].id) || 0,
              id: dataUser.dataUser.id,
              username: dataUser.dataUser.username,
              password: dataUser.dataUser.password,
              email: dataUser.dataUser.email,
              phone: dataUser.dataUser.phone,
              status: dataUser.dataUser.status,
              loading: false,
            })
          } else {
            this.setState({
              errorMessage: data.error || dataUser.error,
              disabled: true,
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
          role_id : this.state.role,
          phone : this.state.phone,
          email : this.state.email,
          status : this.state.status,
        }

        const param = {
          id: this.state.userId,
          dataUser,
        }

        this.setState({loading: true});
        
        this.patchUser(param)
      }
    }

    patchUser = async function(param) {
      const data = await patchUserAddFunction(param);

      if(data) {
        if(!data.error) {
          swal("Success","User berhasil di tambah","success")
          this.setState({
            diKlik: true,
            loading: false,
          })
        } else {
          this.setState({
            errorMessage: data.error,
            disabled: true,
            loading: false,
          })
        }      
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
      this.setState({role: e.target.value})
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
          !this.state.email || this.state.email.length === 0 || !validateEmail(this.state.email)
        ) {
        flag = false;
        errorMessage = 'Mohon input email dengan benar'
      } else if (!this.state.phone || this.state.phone.length === 0 || !validatePhone(this.state.phone)) {
        flag = false;
        errorMessage = 'Mohon input kontak pic dengan benar'
      } else {
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
            <div  key="zz">
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
                 <h3>User - Ubah</h3>
                 
                 <hr/>
                 
                 <form>
                    <div className="form-group row">   
                      <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'left', marginBottom:'2vh'}}>
                        {this.state.errorMessage}
                      </div>    
                    </div>

                    <div className="form-group row" style={{marginBottom:40}}>                
                      <label className="col-sm-2 col-form-label" style={{height:3.5}}>
                        Id Akun
                      </label>
                      <label className="col-sm-1 col-form-label" style={{height:3.5}}>
                        :
                      </label>
                      <div className="col-sm-4 col-form-label" >
                        {this.state.id}
                      </div>                 
                    </div>

                    <div className="form-group row" style={{marginBottom:40}}>                
                      <label className="col-sm-2 col-form-label" style={{height:3.5}}>
                        Nama Akun
                      </label>
                      <label className="col-sm-1 col-form-label" style={{height:3.5}}>
                        :
                      </label>
                      <div className="col-sm-4 col-form-label" >
                        {this.state.username}                       
                      </div>                 
                    </div>

                    <div className="form-group row" style={{marginBottom:30}}>                
                      <label className="col-sm-2 col-form-label" style={{height:3.5}}>
                        Password
                      </label>
                      <label className="col-sm-1 col-form-label" style={{height:3.5}}>
                        :
                      </label>
                      <div className="col-sm-4 col-form-label" >
                        {this.state.password}                       
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
                          <input type="button" value="Ubah" className="btn btn-success" onClick={this.btnSave} />
                          <input type="button" value="Batal" className="btn ml-2" onClick={this.btnCancel} style={{backgroundColor:"grey",color:"white"}}/>
                        </div>
                    </div>
                    
                 </form>
                
                </div>
            )
        }else if(!cookie.get('token')){
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
  // menu: getMenu(),
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
  )(rolePermissionEdit);