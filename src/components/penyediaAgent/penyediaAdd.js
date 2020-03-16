import React from 'react'
import swal from 'sweetalert'
import { Redirect  } from 'react-router-dom'
import { getToken } from '../index/token';
import './../../support/css/penyediaAgent.css'
import { addPenyediaAgentFunction } from './saga';
import { checkPermission } from '../global/globalFunction';
import { Grid, IconButton, Tooltip, FormControlLabel, Checkbox, TextField ,InputAdornment } from '@material-ui/core';
import TitleBar from '../subComponent/TitleBar';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';
import DialogComponent from '../subComponent/DialogComponent';


class PenyediaAdd extends React.Component{
    state = {
        diKlik:false,
        phone:'',
        submit:false,
        name:'',
        pic:'',
        address:'',
        status:false,
        messageDialog:'',
    };

    _isMounted = false;

    componentDidMount(){
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
    
    handleChecked=(e)=>{
        this.setState({status:!this.state.status})
    }


    renderBtnSumbit =()=>{
        if( this.state.submit) {
         return <input type="button" disabled className="btn btn-primary" value="Simpan" onClick={this.btnSaveAgen} style={{cursor:"wait"}}/>
        }else{
        return <input type="button" className="btn btn-primary" value="Simpan" onClick={this.btnSaveAgen}/>
        }
    }

    btnCancel = ()=>{
        this.setState({diKlik:true})
    }

    btnSaveAgen =()=>{
        let status = this.state.status ? "active": "inactive"
        let address = this.state.address
        let name = this.state.name
        let pic = this.state.pic
        let phone = this.state.phone
        if(this.state.phone ===''){
            this.setState({errorMessage:"Nomor Telepon Kosong - Harap cek kembali"})
        }else if(name.trim().length ===0){
            this.setState({errorMessage:"Nama Penyedia Agen Kosong - Harap cek kembali"})
        }else if(pic.trim().length ===0){
            this.setState({errorMessage:"Nama PIC Kosong - Harap cek kembali"})
        }else if(address.trim().length ===0){
            this.setState({errorMessage:"Alamat Kosong - Harap cek kembali"})
        }else if(this.state.phone===''){
            this.setState({errorMessage:"Nomor Telepon Kosong - Harap cek kembali"})
        }else{
            this.setState({submit:true})
            const newData = {
                name,pic,phone,address,status
            }
             this.addAgent(newData)
           
        }
    }

    addAgent = async function (params) {
        const data = await addPenyediaAgentFunction(params)
        if(data){
            if(!data.error){
                swal("Berhasil","Agen Berhasil Di Tambah","success")
                this.setState({diKlik:true})
            }else{
                swal("Tidak Berhasil",`Nomor Telp sudah terdaftar atau ada masalah di server\nSilahkan dicoba kembali`,"error")
                this.setState({submit:false})
            }

        }
    }
    btnConfirmationDialog = (e, nextStep, pesan) => {
        this.setState({dialog: !this.state.dialog,messageDialog:pesan})

        if(nextStep && this.state.messageDialog.includes('save')) {
            this.btnSaveAgen() 
        }
    }
    onChangeTextField = (e, labelData,number) => {
        let dataText = e.target.value;

        if(number && isNaN(dataText)) {           
            dataText = this.state[labelData];          
        }
        this.setState({[labelData]:dataText})
    }

    render(){
        if(this.state.diKlik){
            return <Redirect to='/penyediaList'/>            
        }
        if(getToken()){
            return(
                    <Grid container>
                        <Grid item sm={12} xs={12} style={{maxHeight:50}}>
                            <TitleBar
                             title={'Penyedia Agen - Tambah'}
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
                                    checkPermission('core_agent_provider_new') &&
                                    <Tooltip title="Save" style={{outline:'none'}}>
                                    <IconButton aria-label="save" onClick={()=>this.btnConfirmationDialog('','','Are you sure want to save this data ?')} >
                                        <SaveIcon style={{width:'35px',height:'35px'}}/>
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
                                        onChange={(e) => this.handleChecked(e, 'status')}
                                        color={this.state.status ? "primary":"default"}
                                        value="default"
                                        inputProps={{ 'aria-label': 'checkbox with default color' }}
                                    />
                                }
                                label={'Aktif'}
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

export default PenyediaAdd;