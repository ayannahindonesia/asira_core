import React from 'react'
import { Redirect } from 'react-router-dom'
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/styles';
import { compose } from 'redux';
import { getAgentFunction, patchAgentAddFunction } from './saga'
import { getPenyediaAgentListFunction } from '../penyediaAgent/saga';
import { getAllMitraList } from '../mitra/saga';
import { getToken } from '../index/token';
import { isRoleAccountExecutive, destructAgent, constructAgent } from './function';
import { checkPermission, changeFileToBase64 } from '../global/globalFunction';
import { validateEmail, validatePhone } from '../global/globalFunction';
import { Grid, Tooltip, IconButton, TextField,FormControlLabel,Checkbox } from '@material-ui/core';

import UploadFile from '../subComponent/UploadFile';
import CancelIcon from '@material-ui/icons/Cancel';
import Loading from '../subComponent/Loading'
import DialogComponent from '../subComponent/DialogComponent';
import TitleBar from '../subComponent/TitleBar';
import swal from 'sweetalert'
import DropDown from '../subComponent/DropDown';
import ActionComponent from '../subComponent/ActionComponent';

const styles = (theme) => ({
    container: {
      flexGrow: 1,
    },
  });

class AgentDetail extends React.Component{
    _isMounted = false;

    state = {
      selectedFile:null,
      diKlik:false,
      errorMessage:'',
      agentId: 0,
      kategori: 0,
      kategori_name: '',
      dataAgent: {},
      bank_name: '',
      loading: true,
      status: true,
      agentName: '',
      agent_provider_name: '',
      username: '',
      instansi:'',
      phone:'',
      email:'',
      image:'',
      listBank:[],
      bank:[]
    };

    componentDidMount(){
      this._isMounted = true;

      this.setState({
        agentId: this.props.match.params.id,
      },() => {
        this.refresh();
      })
      
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    refresh = async function() {
      const param = {
        agentId: this.state.agentId
      };
      const data = await getAgentFunction(param, getPenyediaAgentListFunction, getAllMitraList) ;

      if(data) {
        if(!data.error) {
          const dataAgent = destructAgent(data.dataAgent,  false, data.mitraList.data);

          this.setState({
            listBank: data.mitraList.data,
            status: dataAgent.status,
            agentId: dataAgent.id,
            agentName: dataAgent.name,
            username: dataAgent.username,
            phone: dataAgent.phone && dataAgent.phone.toString().substring(2,dataAgent.phone.length),
            email: dataAgent.email,
            kategori: dataAgent.category,
            kategori_name: dataAgent.category_name,
            agent_provider_name: dataAgent.agent_provider_name,
            bank_name: dataAgent.banks_name,
            instansi: dataAgent.instansi,
            selectedFile:dataAgent.image,
            loading: false,
            bank: dataAgent.banks,
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

    UNSAFE_componentWillReceiveProps(newProps){
      this.setState({errorMessage:newProps.error})
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


    onChangeHandler = (event)=>{
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


  btnEditPermission =()=>{
    this.setState({modifyType:true})
  }

    onChangeTextField = (e, labelData, number) => {
      let dataText = e.target.value;

      if(number && isNaN(dataText)) {           
          dataText = this.state[labelData];          
      }

      this.setState({[labelData]:dataText})
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
        errorMessage = 'Mohon input kontak pic dengan benar'
      } else if (!this.state.instansi || this.state.instansi.length === 0) {
        flag = false;
        errorMessage = 'Mohon input instansi dengan benar'
      }else if (!isRoleAccountExecutive(this.state.kategori) && (!this.state.bank || this.state.bank.length === 0)) {
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
    
    btnSave=()=>{
      if (this.validate()) {

        const dataAgent = constructAgent(this.state)
        
        const param = {
          agentId: this.state.agentId,
          dataAgent,
        }

        if(this.state.selectedFile && this.state.selectedFile.split(',')[1]) {
          param.dataAgent.image = this.state.selectedFile.split(',')[1]
        }
        
        this.patchAgent(param)
        
      }
    }

    patchAgent = async function(param) {
      const data = await patchAgentAddFunction(param);

      if(data) {
        if(!data.error) {
          swal("Success","Agen berhasil di ubah","success")
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

    btnConfirmationDialog = (e, nextStep, pesan) => {
      this.setState({dialog: !this.state.dialog,messageDialog:pesan})

      if(nextStep && this.state.messageDialog.includes('save')) {
          this.btnSave() 
      }else if(nextStep && this.state.messageDialog.includes('delete')){
          this.btnDelete()
      }
  }

  handleChecked = (e, labelData)=>{
    this.setState({[labelData]:!this.state[labelData]})
}


    render(){
      if(this.state.diKlik){
        return <Redirect to='/agenList'/>            
      } else if (this.state.loading){
        return  (
            <Loading
            title={this.state.modifyType ? 'Agen - Ubah':'Agen - Detail'}
            />
        )
      } else if(getToken()){
        return(
              <Grid container>

                <Grid item sm={12} xs={12} style={{maxHeight:50}}>
                    <TitleBar
                      title={this.state.modifyType ? 'Agen - Ubah':'Agen - Detail'}
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
                                    modifyType={this.state.modifyType}
                                    permissionEdit={ checkPermission('core_agent_patch') ? (this.state.modifyType ? ()=>this.btnConfirmationDialog('','','Are you sure want to save this data ?') : this.btnEditPermission) : null}
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
                                                   Agen ID
                                                </Grid>
                                                <Grid item xs={12} sm={4} >
                                                    <TextField
                                                        id="agentId"
                                                        value={this.state.agentId}
                                                        onChange={(e) => this.onChangeTextField(e,'agentId')} 
                                                        margin="dense"
                                                        variant="outlined"
                                                        fullWidth
                                                        disabled={true}
                                                    />
                                                </Grid>
                                        </Grid>
                      </Grid>

                      <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                         <Grid container>
                                                <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                                   Nama Agen
                                                </Grid>
                                                <Grid item xs={12} sm={4} >
                                                    <TextField
                                                        id="agentName"
                                                        value={this.state.agentName}
                                                        onChange={(e) => this.onChangeTextField(e,'agentName')} 
                                                        margin="dense"
                                                        variant="outlined"
                                                        fullWidth
                                                        disabled={this.state.modifyType ? false : true}

                                                    />
                                                </Grid>
                                        </Grid>
                      </Grid>

                      <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                         <Grid container>
                                                <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                                   Username
                                                </Grid>
                                                <Grid item xs={12} sm={4} >
                                                    <TextField
                                                        id="username"
                                                        value={this.state.username}
                                                        onChange={(e) => this.onChangeTextField(e,'username')} 
                                                        margin="dense"
                                                        variant="outlined"
                                                        fullWidth
                                                        disabled={true}
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
                                                        value={this.state.email}
                                                        onChange={(e) => this.onChangeTextField(e,'email')} 
                                                        margin="dense"
                                                        variant="outlined"
                                                        fullWidth
                                                        disabled={this.state.modifyType ? false : true}

                                                    />
                                                </Grid>
                                        </Grid>
                      </Grid>

                      <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                         <Grid container>
                                                <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                                   No Handphone
                                                </Grid>
                                                <Grid item xs={12} sm={4} >
                                                    <TextField
                                                        id="phone"
                                                        value={this.state.phone}
                                                        onChange={(e) => this.onChangeTextField(e,'phone',true)} 
                                                        margin="dense"
                                                        variant="outlined"
                                                        fullWidth
                                                        disabled={this.state.modifyType ? false : true}

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
                                                    <TextField
                                                        id="kategori_name"
                                                        value={this.state.kategori_name}
                                                        onChange={(e) => this.onChangeTextField(e,'kategori_name')} 
                                                        margin="dense"
                                                        variant="outlined"
                                                        fullWidth
                                                        disabled={true}
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
                                                    <TextField
                                                        id="instansi"
                                                        value={this.state.instansi}
                                                        onChange={(e) => this.onChangeTextField(e,'instansi')} 
                                                        margin="dense"
                                                        variant="outlined"
                                                        fullWidth
                                                        disabled={true}
                                                    />
                                                </Grid>
                                        </Grid>
                      </Grid>



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
                                                    disabled={this.state.modifyType ? false : true}

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
                                                    onChange={this.onChangeHandler}
                                                    disabled={this.state.modifyType ? false : true}
                                                />
                                                </Grid>
                                                {
                                                    this.state.selectedFile && this.state.modifyType &&
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

                      <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                         <Grid container>
                                                <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                                   Status
                                                </Grid>
                                                <Grid item xs={12} sm={4} >
                                                <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={this.state.status}
                                                    onChange={(e) => this.handleChecked(e, 'status')}
                                                    color={this.state.status ? "primary":"default"}
                                                    value="default"
                                                    inputProps={{ 'aria-label': 'checkbox with default color' }}
                                                    
                                                />
                                            }
                                            label={'Aktif'}
                                            disabled={this.state.modifyType ? false : true}
                                        />
                                                </Grid>
                                        </Grid>
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
    //   },
    //   handleRedirect: (route) => {
    //     dispatch(push(route));
    //   },
    };
}
  
export const mapStateToProps = createStructuredSelector({
  // user: getUserState(),
  // menu: getMenu(),
  // fetching: getFetchStatus(),
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
  )(AgentDetail);