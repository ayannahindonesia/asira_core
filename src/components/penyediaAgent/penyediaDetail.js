import React from 'react'
import { Redirect  } from 'react-router-dom'
import { getToken } from '../index/token';
import './../../support/css/penyediaAgent.css'
import { getPenyediaAgentDetailFunction ,editPenyediaAgentFunction} from './saga';
import Loader from 'react-loader-spinner'

import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
import TitleBar from '../subComponent/TitleBar';
import { Grid, IconButton, Tooltip, FormControlLabel, Checkbox,  } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';

import { checkPermission } from '../global/globalFunction';
import swal from 'sweetalert'
import DialogComponent from '../subComponent/DialogComponent';

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
            console.log(data)
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
                            <Grid container style={{display:'flex', justifyContent:'flex-end', padding:'0'}}>
                            <Grid item xs={2} sm={2} style={{display:'flex', justifyContent:'flex-end'}}>

                                {
                                    checkPermission('core_agent_provider_patch') && this.state.modifyType &&
                                    <Tooltip title="Save" style={{outline:'none'}}>
                                    <IconButton aria-label="save" onClick={()=>this.btnConfirmationDialog('','','Are you sure want to save this data ?')} >
                                        <SaveIcon style={{width:'35px',height:'35px'}}/>
                                    </IconButton>
                                    </Tooltip>
                                }

                                {
                                    checkPermission('core_agent_provider_patch') && !this.state.modifyType &&
                                    <Tooltip title="Edit" style={{outline:'none'}}>
                                    <IconButton aria-label="edit" onClick={this.btnEditPermission}>
                                        <EditIcon style={{width:'35px',height:'35px'}}/>
                                    </IconButton>
                                    </Tooltip>
                                }
                                

                                <Tooltip title="Back" style={{outline:'none'}}>
                                <IconButton aria-label="cancel" onClick={()=> this.setState({diKlik:true})}>
                                    <CancelIcon style={{width:'35px',height:'35px'}}/>
                                </IconButton>
                                </Tooltip>
                            </Grid>
                            </Grid>
                    </Grid>


                  {/* Error */}
                  <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', color:'red'}}>
                      {this.state.errorMessage}
                  </Grid>


                  <Grid item sm={12} xs={12} style={{fontSize:'20px', marginBottom:'10px'}}>
                    <Grid container>

                      <Grid item sm={4} xs={4} style={{padding:'10px'}}>
                        ID Penyedia Agent
                      </Grid>

                      <Grid item sm={8} xs={8} style={{padding:'10px'}}>
                         <input type="text" 
                         className="form-control" 
                         ref="judul" 
                         value={this.state.id}
                         onChange={(e) => this.onChangeTextField(e,'id')} 
                         disabled={ true }
                         required autoFocus
                         style={{width:"80%"}}/>
                      </Grid>

                      <Grid item sm={4} xs={4} style={{padding:'10px'}}>
                        Nama Penyedia Agent
                      </Grid>

                      <Grid item sm={8} xs={8} style={{padding:'10px'}}>
                         <input type="text" 
                         className="form-control" 
                         ref="judul" 
                         value={this.state.name}
                         onChange={(e) => this.onChangeTextField(e,'name')} 
                         disabled={this.state.modifyType ? false : true}
                         required autoFocus
                         style={{width:"80%"}}/>
                      </Grid>

                      
                      <Grid item sm={4} xs={4} style={{padding:'10px'}}>
                        PIC
                      </Grid>

                      <Grid item sm={8} xs={8} style={{padding:'10px'}}>
                         <input type="text" 
                         className="form-control" 
                         ref="judul" 
                         value={this.state.pic}
                         onChange={(e) => this.onChangeTextField(e,'pic')} 
                         disabled={this.state.modifyType ? false : true}
                         required autoFocus
                         style={{width:"80%"}}/>
                      </Grid>

                      
                      <Grid item sm={4} xs={4} style={{padding:'10px'}}>
                        Nomor Telepon
                      </Grid>

                      <Grid item sm={8} xs={8} style={{padding:'10px'}}>
                         <input type="text" 
                         className="form-control" 
                         ref="judul" 
                         value={this.state.phone}
                         onChange={(e) => this.onChangeTextField(e,'phone',true)} 
                         disabled={this.state.modifyType ? false : true}
                         required autoFocus
                         style={{width:"80%"}}/>
                      </Grid>

                      
                      <Grid item sm={4} xs={4} style={{padding:'10px'}}>
                        Alamat
                      </Grid>

                      <Grid item sm={8} xs={8} style={{padding:'10px'}}>
                        <textarea 
                        rows="10" 
                        disabled={this.state.modifyType ? false : true}
                        onChange={(e) => this.onChangeTextField(e,'address')} 
                        className="form-control" 
                        style={{width:"80%"}}
                        value={this.state.address} 
                        placeholder="Description.." required autoFocus/>
                      </Grid>

                      
                      <Grid item sm={4} xs={4} style={{padding:'10px'}}>
                        Status
                      </Grid>

                      <Grid item sm={8} xs={8} style={{paddingLeft:'12%'}}>
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