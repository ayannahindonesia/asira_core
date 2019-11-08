import React from 'react'
import { Redirect } from 'react-router-dom'
import Loader from 'react-loader-spinner'
import CheckBox from '@material-ui/core/Checkbox';
import DropDown from '../subComponent/DropDown';
import swal from 'sweetalert';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import { compose } from 'redux';
import { getAllRoleFunction } from '../rolePermission/saga'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { postAgentAddFunction } from './saga';
import { validateEmail, validatePhone } from '../global/globalFunction';
import { getToken } from '../index/token';
import { getAllBankList } from '../bank/saga';

const styles = (theme) => ({
    container: {
      flexGrow: 1,
    },
    textField: {
      border: '1px solid',
    },
  });


class agentAdd extends React.Component{
    _isMounted = false;

    state = {
      diKlik:false,
      errorMessage:'',
      role : 0,
      bank: [],
      listKategori:[
        {
          id : 'Agen',
          name: 'Agen',
        },
        {
          id : 'Account Executive',
          name: 'Account Executive',
        }
      ],
      listPenyediaAgent: [],
      listBank: [],
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

    refresh = async function() {
      const param = {};
      const data = await getAllBankList(param, getAllRoleFunction) ;

      if(data) {
        if(!data.error) {
          this.setState({
            listBank: data.data.data,
            listPenyediaAgent: data.dataRole,
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

    isRoleBank = (role) => {
      let flag = false;
      const dataRole = this.state.listRole;

      if(role && role !== 0) {
        for(const key in dataRole) {
          if(dataRole[key].id.toString() === role.toString() && dataRole[key].system.toString().toLowerCase().includes('dashboard')) {
            flag = true;
            break;
          }
        }
        
      } 

      return flag;
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
          roles : [parseInt(this.state.role)],
          bank: this.isRoleBank(this.state.role) ? this.state.bank : null,
          phone : this.state.phone,
          email : this.state.email,
          status : this.state.status ? 'active' : 'inactive',
        }

        const param = {
          dataUser,
        }

        this.setState({loading: true});
        
        this.postUser(param)
      }
    }

    postUser = async function(param) {
      const data = await postAgentAddFunction(param);

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
      const labelName = e.target.name.toString().toLowerCase();

      this.setState({[labelName]: e.target.value},(labelName) => { 
        if(labelName === 'role') {
          this.getBankList();
        } 
      })
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
      } else if (this.isRoleBank(this.state.role) && (!this.state.bank || this.state.bank === 0)) {
        flag = false;
        errorMessage = 'Mohon input bank dengan benar'
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
          return <Redirect to='/listAgent'/>            
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
        } else if(getToken()){
          return(
              <div className="container mt-4">
                <h3>Agen - Tambah</h3>
                                
                <hr/>
                
                <form>
                  <div className="form-group row">   
                    <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'left', marginBottom:'2vh'}}>
                      {this.state.errorMessage}
                    </div>    
                  </div>

                  <div className="form-group row" style={{marginBottom:40}}>                
                    <label className="col-sm-2 col-form-label" style={{height:3.5}}>
                      Nama Agen
                    </label>
                    <label className="col-sm-1 col-form-label" style={{height:3.5}}>
                      :
                    </label>
                    <div className="col-sm-4" >
                      <TextField
                        id="agentName"
                        onChange={this.onChangeTextField}
                        value={this.state.agentName}
                        hiddenLabel
                        fullWidth
                        placeholder="Nama Agen"
                        style={{border:'1px groove', paddingLeft:'5px'}}
                      />
                    </div>                 
                  </div>

                  <div className="form-group row" style={{marginBottom:40}}>                
                    <label className="col-sm-2 col-form-label" style={{height:3.5}}>
                      Id Pengguna (username)
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
                        placeholder="Username"
                        style={{border:'1px groove', paddingLeft:'5px'}}
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
                      No HP
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
                        placeholder="Nomor Handphone"
                        style={{border:'1px groove', paddingLeft:'5px'}}
                      />
                    </div>                   
                  </div>


                  <div className="form-group row" style={{marginBottom:7}}>                   
                    <label className="col-sm-2 col-form-label" style={{lineHeight:3.5}}>
                      Kategori
                    </label>
                    <label className="col-sm-1 col-form-label" style={{lineHeight:3.5}}>
                      :
                    </label>
                    <div className="col-sm-4">
                      <DropDown
                        value={this.state.role}
                        label="Role"
                        data={this.state.listKategori}
                        id="id"
                        labelName={"name-system"}
                        onChange={this.onChangeDropDown}
                        fullWidth
                      />
                    </div>                 
                  </div>

                  <div className="form-group row" style={{marginBottom:7}}>                   
                    <label className="col-sm-2 col-form-label" style={{lineHeight:3.5}}>
                      Instansi
                    </label>
                    <label className="col-sm-1 col-form-label" style={{lineHeight:3.5}}>
                      :
                    </label>
                    <div className="col-sm-4">
                      <DropDown
                        value={this.state.role}
                        label="Instansi"
                        data={this.state.listPenyediaAgent}
                        id="id"
                        labelName={"name-system"}
                        onChange={this.onChangeDropDown}
                        fullWidth
                      />
                    </div>                 
                  </div>

                  
                  <div className="form-group row" style={{marginBottom:20}}>                   
                    <label className="col-sm-2 col-form-label" style={{lineHeight:3.5}}>
                      Bank
                    </label>
                    <label className="col-sm-1 col-form-label" style={{lineHeight:3.5}}>
                      :
                    </label>
                    <div className="col-sm-4">
                      <DropDown
                        multiple={true}
                        value={this.state.bank}
                        label="Bank"
                        data={this.state.listBank}
                        id="id"
                        labelName="name"
                        onChange={this.onChangeDropDown}
                        fullWidth
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
                        <input type="button" value="Simpan" className="btn btn-success" onClick={this.btnSave} />
                        <input type="button" value="Batal" className="btn ml-2" onClick={this.btnCancel} style={{backgroundColor:"grey",color:"white"}}/>
                      </div>
                  </div>
                  
                </form>
              
              </div>
          )
        } else if(getToken()){
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
  )(agentAdd);