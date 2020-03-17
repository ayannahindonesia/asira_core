import React from 'react'
import { Redirect  } from 'react-router-dom'
import { getToken } from '../index/token';
import './../../support/css/penyediaAgent.css'
import { getPenyediaAgentDetailFunction ,editPenyediaAgentFunction} from './saga';
import Loader from 'react-loader-spinner'

import TitleBar from '../subComponent/TitleBar';
import { Grid, FormControlLabel, Checkbox, TextField,InputAdornment } from '@material-ui/core';

import { checkPermission } from '../global/globalFunction';
import swal from 'sweetalert'
import DialogComponent from '../subComponent/DialogComponent';
import ActionComponent from '../subComponent/ActionComponent';

class PenyediaDetail extends React.Component{
    state = {
        diKlik:false,
        phone:'',
        submit:false,
        check:false,
        name:'',
        pic:'',
        address:'',
        status:'',
        messageDialog:'',
        loading:true
    };

    _isMounted = false;

    componentDidMount(){
        this._isMounted = true;
        this.getDetailAgent()
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
    getDetailAgent = async function () {
        const id =this.props.match.params.id

        const data = await getPenyediaAgentDetailFunction({id})

        if(data){
            if(!data.error){
                this.setState({
                    id:data.dataAgentDetail.id,
                    name:data.dataAgentDetail.name,
                    pic:data.dataAgentDetail.pic,
                    phone:data.dataAgentDetail.phone,
                    address:data.dataAgentDetail.address,
                    status:data.dataAgentDetail.status === 'active'?true:false,
                    loading:false })
            }else{
                this.setState({errorMessage:data.error,loading:false})
            }

        }
        
    }

    onChangeTextField = (e, labelData,number) => {
        let dataText = e.target.value;

        if(number && isNaN(dataText)) {           
            dataText = this.state[labelData];          
        }
        this.setState({[labelData]:dataText})
    }
    
    btnCancel = ()=>{
        this.setState({diKlik:true})
    }

    btnEditPermission = () => {
        this.setState({modifyType: true})
    }
    btnConfirmationDialog = (e, nextStep, pesan) => {
        this.setState({dialog: !this.state.dialog,messageDialog:pesan})

        if(nextStep && this.state.messageDialog.includes('save')) {
            this.btnEditAgen() 
        }else if(nextStep && this.state.messageDialog.includes('delete')){
            this.btnDeleteAgen()
        }
    }

    btnEditAgen =()=>{
        let status = this.state.status ? "active": "inactive"
        let address = this.state.address
        let pic = this.state.pic
        let phone = String(this.state.phone)

        if(pic.trim().length ===0){
            this.setState({errorMessage:"Nama PIC Kosong - Harap cek kembali"})
        }else if(address.trim().length ===0){
            this.setState({errorMessage:"Alamat Kosong - Harap cek kembali"})
        }else if(phone.trim().length <6){
            this.setState({errorMessage:"No Telp terlalu pendek - Harap cek kembali"})
        }
        else{
            this.setState({submit:true})
            const param ={
                id :this.props.match.params.id,
                newData:{
                    pic,phone,status,address
                }
            }

            this.editPenyediaAgent(param)
           
        }
    }

    editPenyediaAgent = async function (params) {
        const data = await editPenyediaAgentFunction(params)
        if(data){
            if(!data.error){
                this.setState({diKlik:true})
                swal("Berhasil","Penyedia Agent Berhasil di ubah","success")
            }else{
                this.setState({submit:false})
                swal("Tidak Berhasil",`Nomor Telp sudah terdaftar atau ada masalah di server\nSilahkan dicoba kembali`,"error")

            }
        }
    }

    handleChecked = (e, labelData)=>{
        this.setState({[labelData]:!this.state[labelData]})
    }
    render(){
        if(this.state.loading){
          
                return (
                    <div className="mt-2">
                     <Loader 
                        type="ThreeDots"
                        color="#00BFFF"
                        height="30"	
                        width="30"
                    />  
                    </div>
                )
            
        }
        if(this.state.diKlik){
            return <Redirect to='/penyediaList'/>            
        }
        if(getToken()){
            return(
                <Grid container>
                        <Grid item sm={12} xs={12} style={{maxHeight:50}}>
                            <TitleBar
                             title={this.state.modifyType ? 'Penyedia Agen - Ubah':'Penyedia Agen - Detail'}
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
                                    permissionEdit={ checkPermission('core_agent_provider_patch') ? (this.state.modifyType ? ()=>this.btnConfirmationDialog('','','Are you sure want to save this data ?') : this.btnEditPermission) : null}
                                    onCancel={this.btnCancel}
                                />
                    </Grid>


                  {/* Error */}
                  <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', color:'red'}}>
                      {this.state.errorMessage}
                  </Grid>


                  <Grid item sm={12} xs={12} style={{fontSize:'20px', marginBottom:'10px'}}>
                    <Grid container>

                    <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                    ID Penyedia Agent

                                    </Grid>
                                    <Grid item xs={12} sm={4} >
                                        <TextField
                                            id="id"
                                            value={this.state.id}
                                            onChange={(e) => this.onChangeTextField(e,'id')} 
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
                                    Nama Penyedia Agent

                                    </Grid>
                                    <Grid item xs={12} sm={4} >
                                        <TextField
                                            id="name"
                                            value={this.state.name}
                                            onChange={(e) => this.onChangeTextField(e,'name')} 
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
                                    PIC

                                    </Grid>
                                    <Grid item xs={12} sm={4} >
                                        <TextField
                                            id="pic"
                                            value={this.state.pic}
                                            onChange={(e) => this.onChangeTextField(e,'pic')} 
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
                                    Nomor Telepon

                                    </Grid>
                                    <Grid item xs={12} sm={4} >
                                        <TextField
                                            id="phone"
                                            value={this.state.phone}
                                            onChange={(e) => this.onChangeTextField(e,'phone',true)} 
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">+62</InputAdornment>,
                                              }}
                                            disabled={this.state.modifyType ? false : true}

                                        />
                                </Grid>
                            </Grid>
                    </Grid>

                    <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                     Alamat

                                    </Grid>
                                    <Grid item xs={12} sm={4} >
                                        <TextField
                                            id="address"
                                            value={this.state.address}
                                            onChange={(e) => this.onChangeTextField(e,'address')} 
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            multiline
                                            disabled={this.state.modifyType ? false : true}

                                        />
                                </Grid>
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
        }
        if(!getToken()){
            return (
                <Redirect to='/login' />
            )    
        }
       
    }
}

export default PenyediaDetail;