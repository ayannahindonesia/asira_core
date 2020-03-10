import React from 'react'
import { Redirect } from 'react-router-dom'
import swal from 'sweetalert'
import { AddTipeBankFunction } from './saga';
import { getToken } from '../index/token';
import DialogComponent from '../subComponent/DialogComponent';
import { Grid, Tooltip, IconButton, TextField } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';
import { checkPermission } from '../global/globalFunction';
import TitleBar from '../subComponent/TitleBar';
import Loading from '../subComponent/Loading';

class TipeMitraAdd extends React.Component{
    _isMounted = false;
    state={
        diKlik:false,
        errorMessage:'',
        namaTipeMitra: '',
        description: '',
        dialog: false,
        loading: false,
    }
    
    UNSAFE_componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }
    componentDidMount(){
        this._isMounted = true;
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    onChangeTextField = (e, labelData, number) => {
        let dataText = e.target.value;

        if(number && isNaN(dataText)) {           
            dataText = this.state[labelData];          
        }

        this.setState({[labelData]:dataText})
    }

    btnConfirmationDialog = (e, nextStep) => {
        this.setState({dialog: !this.state.dialog})

        if(nextStep) {
            this.setState({loading:true})
            this.btnSave()
        }
    }

    btnSave=()=>{
        var name= this.state.namaTipeMitra
        var description = this.state.description
  
        if (name ===""||name.trim()===""){
            this.setState({errorMessage:"Nama Tipe Mitra Kosong - Harap cek ulang"})
        }else{
            var newData={name,description}
            this.AddTipeMitraAdd(newData)
        }
    }

    AddTipeMitraAdd = async function (params) {
        const data = await AddTipeBankFunction(params)
        if(data){
            if(!data.error){
                this.setState({diKlik:true,errorMessage:"",loading:false})
                swal("Success","Tipe Mitra Berhasil di Tambah","success")
            }else{
                this.setState({errorMessage:data.error,loading:false})
            }
        }
    }
    
    btnCancel =()=>{
        this.setState({diKlik:true})
    }

    render(){
        if(this.state.diKlik){
            return <Redirect to="/tipeList"/>
        } else if(this.state.loading) {
            return(
                <Loading
                    title={'Tipe Mitra - Tambah'}
                />
            )
            
             
        } else if(getToken()){
            return(
                <Grid container>

                    <Grid item sm={12} xs={12} style={{maxHeight:50}}>
                        
                        <TitleBar
                            title={'Tipe Mitra - Tambah'}
                        />

                    </Grid>
                    <Grid
                        item
                        sm={12} xs={12}
                        style={{padding:'20px', marginBottom:20, boxShadow:'0px -3px 25px rgba(99,167,181,0.24)', WebkitBoxShadow:'0px -3px 25px rgba(99,167,181,0.24)', borderRadius:'15px'}}                  
                    >
                        <Grid container>
                            {/* Dialog */}
                            <DialogComponent 
                                title={'Confirmation'}
                                message={'Are you sure want to save this data ?'}
                                type={'textfield'}
                                openDialog={this.state.dialog}
                                onClose={this.btnConfirmationDialog}
                            />
                            {/* Action Button */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', color:'red', display:'flex', justifyContent:'flex-end'}}>
                                <Grid container style={{display:'flex', justifyContent:'flex-end', padding:'0'}}>
                                    <Grid item xs={2} sm={2} style={{display:'flex', justifyContent:'flex-end'}}>
                                        
                                        {
                                           checkPermission('core_bank_type_new') &&
                                            <Tooltip title="Save" style={{outline:'none'}}>
                                                <IconButton aria-label="save" onClick={this.btnConfirmationDialog} >
                                                    <SaveIcon style={{width:'35px',height:'35px'}} />
                                                </IconButton>
                                            </Tooltip>
                                        }

                                        <Tooltip title="Back" style={{outline:'none'}}>
                                            <IconButton aria-label="cancel" onClick={this.btnCancel}>
                                                <CancelIcon style={{width:'35px',height:'35px'}} />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/* Error */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', color:'red'}}>
                                {this.state.errorMessage}
                            </Grid>
                            {/* Nama Tipe Mitra */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                        Nama Tipe Mitra
                                    </Grid>
                                    <Grid item xs={4} sm={4} >
                                        <TextField
                                            id="namaTipeMitra"
                                            value={this.state.namaTipeMitra}
                                            onChange={(e) => this.onChangeTextField(e,'namaTipeMitra')} 
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/* Deskripsi Tipe Mitra */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                        Deskripsi
                                    </Grid>
                                    <Grid item xs={4} sm={4} >
                                        <TextField
                                            id="description"
                                            value={this.state.description}
                                            onChange={(e) => this.onChangeTextField(e,'description')} 
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            multiline
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>


                        </Grid>
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

export default TipeMitraAdd;