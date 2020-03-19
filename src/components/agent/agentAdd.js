import React from 'react'
import { Redirect } from 'react-router-dom'
import Loader from 'react-loader-spinner'
import DialogComponent from '../subComponent/DialogComponent';
import DropDown from '../subComponent/DropDown';
import swal from 'sweetalert';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/styles';
import { compose } from 'redux';
import { postAgentAddFunction } from './saga';
import { getToken } from '../index/token';
import { getAllMitraList } from '../mitra/saga';
import { getPenyediaAgentListFunction } from '../penyediaAgent/saga';
import { isRoleAccountExecutive, constructAgent } from './function';

import CancelIcon from '@material-ui/icons/Cancel';
import TitleBar from '../subComponent/TitleBar';
import { Grid, IconButton, Tooltip, FormControlLabel, Checkbox, TextField,InputAdornment } from '@material-ui/core';
import UploadFile from '../subComponent/UploadFile';
import ActionComponent from './../subComponent/ActionComponent'
import { checkPermission,changeFileToBase64,validateEmail,validatePhone } from '../global/globalFunction';

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
      selectedFile:null,
      diKlik:false,
      errorMessage:'',
      kategori : 'agent',
      bank: [],
      instansi: 0,
      listKategori:[
        {
          id : 'agent',
          name: 'Agen',
        },
        {
          id : 'account_executive',
          name: 'Account Executive',
        }
      ],
      listPenyediaAgent: [],
      listBank: [],
      loading: true,
      status: true,
      agentName: '',
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

    valueHandler = ()=>{
      return  this.state.selectedFile ? this.state.selectedFile.name :"Browse Image"
      
    }
    onChangeHandler = (event)=>{
    //untuk mendapatkan file image
       this.setState({selectedFile:event.target.files[0]})
    }

    refresh = async function() {
      const param = {};
      const data = await getPenyediaAgentListFunction(param, getAllMitraList) ;

      if(data) {
        if(!data.error) {
          const listPenyediaAgent = data.dataListAgent.data;
          let instansi = 0;

          for(const key in listPenyediaAgent) {
            if(listPenyediaAgent[key].id) {
              instansi = listPenyediaAgent[key].id
            }
          }

          this.setState({
            listBank: data.mitraList.data,
            listPenyediaAgent,
            instansi,
            bank: [],
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

    UNSAFE_componentWillReceiveProps(newProps){
      this.setState({errorMessage:newProps.error})
    }

    btnSave=()=>{
      if (this.validate()) {
        
        const dataAgent = constructAgent(this.state, true);
        const param = {
          dataAgent,
        }
        if(this.state.selectedFile && this.state.selectedFile.split(',')[1]) {
          param.dataAgent.image = this.state.selectedFile.split(',')[1]
        }
     
        this.postAgent(param)
        
       
        
      }
    }
    btnConfirmationDialog = (e, nextStep, pesan) => {
      this.setState({dialog: !this.state.dialog,messageDialog:pesan})

      if(nextStep && this.state.messageDialog.includes('save')) {
          this.btnSave() 
      }else if(nextStep && this.state.messageDialog.includes('delete')){
          this.btnDelete()
      }
  }
    btnCancel = ()=>{
      this.setState({diKlik:true})
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

      if(labelName !== 'agentName' && (value.includes(' ') || value.includes('\'') || value.includes('"') || value.includes(',')) ) {
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
      let instansi = e.target.value;

      if(labelName === 'kategori') {
        if(e.target.value === 'agent') {
          for(const key in this.state.listPenyediaAgent) {
            instansi = this.state.listPenyediaAgent[key].id;
            break;
          }
        } else if(e.target.value === 'account_executive') {
          for(const key in this.state.listBank) {
            instansi = this.state.listBank[key].id;
            break;
          }
        }
        this.setState({instansi})
      }

      this.setState({
        [labelName]: e.target.value,
        bank: [],
      })
    }

    onChangeDropDownMultiple = (e) => {
      const dataBank = this.state.listBank;
      const lastBank = this.state.bank;
      const newBank = e.target.value[e.target.value.length - 1];
      const newListBank = [];
      let flag = true;

      for(const key in lastBank) {
        if(lastBank[key].id.toString().toLowerCase() !== newBank.toString().toLowerCase()) {
          newListBank.push(lastBank[key])
        } else {
          flag = false;
        }
      }

      if(flag) {
        for(const key in dataBank) {
          if(
            dataBank[key].id.toString().toLowerCase() === newBank.toString().toLowerCase() 
          ) {
            newListBank.push(dataBank[key])
            break;
          } 
        }
      }

      this.setState({bank : newListBank})
    }

    postAgent = async function(param) {
      const data = await postAgentAddFunction(param);

      if(data) {
        if(!data.error) {
          swal("Success","Agen berhasil di tambah","success")
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

    onChangeHandlerImage=(event)=>{
      let input = event.target;
      this.formatImage(input.files[0])
    }
    removeImage = (e,labelData) => {
      this.setState({[labelData]: null})
    }
  
    
    formatImage = async function(file) {
      let data = file && await changeFileToBase64(file);
      
      if(data) {
        
          if(!data.error) {
              this.setState({selectedFile:data, file})
          } else {
              this.setState({errorMessage:data.error})
          }
      }
    }
  

    validate = () => {
      let flag = true;
      let errorMessage = '';

      if (!this.state.username || this.state.username.length === 0) {
        flag = false;
        errorMessage = 'Mohon input username dengan benar'
      } else if (!this.state.agentName || this.state.agentName.trim().length === 0) {
        flag = false;
        errorMessage = 'Mohon input nama agen dengan benar'
      } else if (!this.state.email || this.state.email.length === 0 || !validateEmail(this.state.email) ) {
        flag = false;
        errorMessage = 'Mohon input email dengan benar'
      } else if (!this.state.phone || this.state.phone.length === 0 || !validatePhone(`62${this.state.phone}`)) {
        flag = false;
        errorMessage = 'Mohon input nomor hp dengan benar'
      } else if (!this.state.instansi || this.state.instansi.length === 0) {
        flag = false;
        errorMessage = 'Mohon input instansi dengan benar'
      }else if (!isRoleAccountExecutive(this.state.kategori) && (!this.state.bank || this.state.bank.length === 0)) {
        flag = false;
        errorMessage = 'Mohon input mitra dengan benar'
      } else {
        errorMessage = ''
      }
         
      this.setState({
        errorMessage,
      })

      return flag;
    }

    btnCancel=()=>{
      this.setState({diKlik:true})
    }

    render(){
        if(this.state.diKlik){
          return <Redirect to='/agenList'/>            
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
                <Grid container>
                       <Grid item sm={12} xs={12} style={{maxHeight:50}}>
                            <TitleBar
                             title={'Agen - Tambah'}
                            />
                        </Grid>

                        <Grid
                        item
                        sm={12} xs={12}
                        style={{padding:'20px', marginBottom:20, boxShadow:'0px -3px 25px rgba(99,167,181,0.24)', WebkitBoxShadow:'0px -3px 25px rgba(99,167,181,0.24)', borderRadius:'15px'}}                  
                        >

                        <Grid container>

                        <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', color:'red', display:'flex', justifyContent:'flex-end'}}>
                            <ActionComponent
                              permissionAdd={ checkPermission('core_agent_new') ?  ()=>this.btnConfirmationDialog('','','Are you sure want to save this data ?'): null}
                              onCancel={this.btnCancel}
                            />
                        </Grid>
                      


                  {/* Error */}
                  <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', color:'red'}}>
                      {this.state.errorMessage}
                  </Grid>

                  <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                    Nama Agen
                                    </Grid>
                                    <Grid item xs={12} sm={4} >
                                      <TextField
                                      id="agentName"
                                      onChange={this.onChangeTextField}
                                      value={this.state.agentName}
                                      margin="dense"
                                      variant="outlined"
                                      fullWidth
                                      placeholder="Nama Agen"
                                      />
                                </Grid>
                            </Grid>
                    </Grid>

                    <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                    Id Pengguna (username)
                                    </Grid>
                                    <Grid item xs={12} sm={4} >
                                    <TextField
                                    id="username"
                                    onChange={this.onChangeTextField}
                                    value={this.state.username}
                                    margin="dense"
                                    variant="outlined"
                                    fullWidth
                                    placeholder="Username"
                                  />
                                </Grid>
                            </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                    Email
                                    </Grid>
                                    <Grid item xs={12} sm={4} >
                                    <TextField
                                      id="email"
                                      type="email"
                                      onChange={this.onChangeTextField}
                                      value={this.state.email}
                                      fullWidth
                                      margin="dense"
                                      variant="outlined"
                                      placeholder="Email"
                                    />
                                </Grid>
                            </Grid>
                    </Grid>

                    <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                    Nomor Handphone
                                    </Grid>
                                    <Grid item xs={12} sm={4} >
                                      <TextField
                                        id="phone"
                                        type="tel"
                                        onChange={this.onChangeTextField}
                                        value={this.state.phone}
                                        margin="dense"
                                        variant="outlined"
                                        fullWidth
                                        placeholder="Nomor Handphone"
                                        InputProps={{
                                          startAdornment: <InputAdornment position="start">+62</InputAdornment>,
                                        }}
                               
                                      />
                                </Grid>
                            </Grid>
                    </Grid>

                    <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                    Kategori
                                    </Grid>
                                    <Grid item xs={12} sm={4} >
                                    <DropDown
                                      value={this.state.kategori}
                                      label="Kategori"
                                      data={this.state.listKategori}
                                      id="id"
                                      labelName={"name"}
                                      onChange={this.onChangeDropDown}
                                      fullWidth
                                    />
                                </Grid>
                            </Grid>
                    </Grid>

                    <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                    Instansi
                                    </Grid>
                                    <Grid item xs={12} sm={4} >
                                    <DropDown
                                      value={this.state.instansi}
                                      label="Instansi"
                                      data={isRoleAccountExecutive(this.state.kategori) ? this.state.listBank : this.state.listPenyediaAgent}
                                      id="id"
                                      labelName={"name"}
                                      onChange={this.onChangeDropDown}
                                      fullWidth
                                    />
                                </Grid>
                            </Grid>
                    </Grid>
                    {
                    !isRoleAccountExecutive(this.state.kategori) &&
                    <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                    Mitra Pelayanan
                                    </Grid>
                                    <Grid item xs={12} sm={4} >
                                    <DropDown
                                      multiple={true}
                                      value={this.state.bank}
                                      label="Bank"
                                      data={this.state.listBank}
                                      id="id"
                                      labelName="name"
                                      onChange={this.onChangeDropDownMultiple}
                                      fullWidth
                                    />
                                </Grid>
                            </Grid>
                    </Grid>
                     }
                    <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                    Status
                                    </Grid>
                                    <Grid item xs={12} sm={4} >
                                    <FormControlLabel
                                      control={
                                        <Checkbox       
                                          color="default"           
                                          onChange={this.onChangeCheck}
                                          checked={this.state.status}
                                          style={{justifyContent:'left'}}
                                        />  
                                      }
                                      label={this.state.status ? "Aktif" : "Tidak Aktif"}
                                    />
                                </Grid>
                            </Grid>
                    </Grid>

                    <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                         <Grid container>
                                                <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                                   Gambar
                                                </Grid>
                                                <Grid item xs={12} sm={4} >
                                                <UploadFile
                                                    file={this.state.selectedFile}
                                                    onChange={this.onChangeHandlerImage}
                                                />
                                                </Grid>
                                                {
                                                    this.state.selectedFile && 
                                                    <Grid item xs={1} sm={1} style={{paddingTop:'20px'}}>
                                                        <Tooltip title="Remove" style={{outline:'none'}}>
                                                            <IconButton aria-label="cancel" onClick={(e) => this.removeImage(e,'selectedFile')} >
                                                                <CancelIcon style={{width:'35px',height:'35px'}} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Grid>
                                                }
                                        </Grid>
                      </Grid>

                        </Grid>
                        <DialogComponent 
                    title={'Confirmation'}
                    message={this.state.messageDialog}
                    type={'textfield'}
                    openDialog={this.state.dialog}
                    onClose={this.btnConfirmationDialog}
                  />
                        </Grid>
                </Grid>
               
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