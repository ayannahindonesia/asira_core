import React from 'react'
import '../../support/css/layananAdd.css'
import { Redirect } from 'react-router-dom'
import {TujuanAddFunction} from './saga'
import swal from 'sweetalert'
import { getToken } from '../index/token';
import ActionComponent from '../subComponent/ActionComponent';
import TitleBar from '../subComponent/TitleBar';
import { Grid, TextField,FormControlLabel,Checkbox } from '@material-ui/core';

import { checkPermission } from '../global/globalFunction';
import DialogComponent from '../subComponent/DialogComponent';

class TujuanAdd extends React.Component{
    _isMounted = false;
    state={
        errorMessage:'',
        diKlik:false,status:false,submit:false,name:''
    }
    componentDidMount(){
        this._isMounted = true;
    }
  
    componentWillUnmount() {
        this._isMounted = false;
    }
    UNSAFE_componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }
    
    btnSimpanLayanan = ()=>{
        var name =this.state.name
        var status =  this.state.status?"active":"inactive"

        if(name==="" || name.trim()===""){
            this.setState({errorMessage:"Tujuan field Kosong -  Harap cek ulang"})
        }else{
                var newData={name,status}
                this.setState({submit:true})
                this.TujuanAddBtn(newData)
        }
    }
    
    TujuanAddBtn = async function (params) {
        const data = await TujuanAddFunction(params)

        if(data){
            if(!data.error){
                swal("Success","Tujuan berhasil di tambah","success")
                this.setState({errorMessage:null,diKlik:true})
            }else{
                this.setState({errorMessage:data.error,submit:false})
            }
        }
        
        
    }
    btnConfirmationDialog = (e, nextStep, pesan) => {
        this.setState({dialog: !this.state.dialog,messageDialog:pesan})

        if(nextStep && this.state.messageDialog.includes('save')) {
            this.btnSimpanLayanan() 
        }
    }

    
    
    onChangeTextField = (e, labelData,number) => {
        let dataText = e.target.value;

        if(number && isNaN(dataText)) {           
            dataText = this.state[labelData];          
        }
        this.setState({[labelData]:dataText})
    }

    handleChecked = (e, labelData)=>{
        this.setState({[labelData]:!this.state[labelData]})
    }
    btnCancel = ()=>{
        this.setState({diKlik:true})
    }
 
    render(){
        if(this.state.diKlik){
            return <Redirect to='/tujuanList'/>            

        }
        if(getToken()){
            return(
                    <Grid container>
                        <Grid item sm={12} xs={12} style={{maxHeight:50}}>
                            <TitleBar
                                title={ 'Tujuan Pinjaman - Tambah'}
                            />
                        </Grid>

                        
                        <Grid
                            item
                            sm={12} xs={12}
                            style={{padding:'20px', marginBottom:20, boxShadow:'0px -3px 25px rgba(99,167,181,0.24)', WebkitBoxShadow:'0px -3px 25px rgba(99,167,181,0.24)', borderRadius:'15px'}}                  
                        >

                        <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', color:'red', display:'flex', justifyContent:'flex-end'}}>
                                <ActionComponent
                                    permissionAdd={ checkPermission('core_loan_purpose_new') ?  ()=>this.btnConfirmationDialog('','','Are you sure want to save this data ?')  : null}
                                    onCancel={this.btnCancel}
                                />
                        </Grid>
                                <DialogComponent 
                            title={'Confirmation'}
                            message={this.state.messageDialog}
                            type={'textfield'}
                            openDialog={this.state.dialog}
                            onClose={this.btnConfirmationDialog}
                        />

                         {/* Error */}
                        <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', color:'red'}}>
                            {this.state.errorMessage}
                        </Grid>


                        <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                            <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                        Tujuan Pembiayaan
                                    </Grid>
                                    <Grid item xs={12} sm={4} >
                                        <TextField
                                            id="name"
                                            value={this.state.name}
                                            onChange={(e) => this.onChangeTextField(e,'name')} 
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            placeholder={"Masukan Tujuan Pembiayaan"}
                                        />
                                    </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                            <Grid container>
                            <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                         Status
                                    </Grid>
                                    <Grid item xs={4} sm={4} >
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

                                        />
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

export default TujuanAdd;