import React from 'react'
import { Redirect } from 'react-router-dom'
import {TujuanDetailFunction,TujuanEditFunction} from './saga'
import { getToken } from '../index/token';
import { Grid, Tooltip, IconButton, TextField,FormControlLabel,Checkbox } from '@material-ui/core';
import { checkPermission } from '../global/globalFunction';

import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';

import DialogComponent from '../subComponent/DialogComponent';
import TitleBar from '../subComponent/TitleBar';
import swal from 'sweetalert'


class TujuanDetail extends React.Component{
    _isMounted = false
    state = {
            diKlik:false,
            id:'',
            name:'',
            status:false,
            }
    componentDidMount(){
        this._isMounted = true;
        this.getTypeBankDetail()
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    getTypeBankDetail = async function () {
        var id = this.props.match.params.id
        
        const param = {
            id,
        }

        const data = await TujuanDetailFunction(param)

        if(data){
            if(!data.error){
                this.setState({
                    name:data.name,
                    id:data.id,
                    status:data.status === 'active'?true:false,})
            }else{
                this.setState({errorMessage:data.error})
            }
        }
    }
    
    handleChecked = (e, labelData)=>{
        this.setState({[labelData]:!this.state[labelData]})
    }

    onChangeTextField = (e, labelData,number) => {
        let dataText = e.target.value;

        if(number && isNaN(dataText)) {           
            dataText = this.state[labelData];          
        }
        this.setState({[labelData]:dataText})
    }

    btnCancel =()=>{
        this.setState({diKlik:true})
    }
    btnEditPermission = () => {
        this.setState({modifyType: true})
    }

    btnConfirmationDialog = (e, nextStep, pesan) => {
        this.setState({dialog: !this.state.dialog,messageDialog:pesan})

        if(nextStep && this.state.messageDialog.includes('save')) {
            this.btnUpdateLayanan() 
        }else if(nextStep && this.state.messageDialog.includes('delete')){
            this.btnDeleteLayanan()
        }
    }

    //EDIT

    btnUpdateLayanan = ()=>{
        var name =this.state.name
        var status = this.state.status?"active":"inactive"
        var id = this.props.match.params.id
            
        if(name==="" || name.trim()===""){
            this.setState({errorMessage:"Tujuan field Kosong -  Harap cek ulang"})
        }else{
                this.setState({submit:true})

                var newData={name,status}
                const param = {
                    id, newData
                }
                this.getEditTujuan(param)
            }
    }
    getEditTujuan = async function(param){
        const data = await TujuanEditFunction(param)
        if(data){
            if(!data.error){
                swal("Success","Tujuan berhasil diubah","success")
                this.setState({errorMessage:null,diKlik:true,submit:false})
            }else{
                this.setState({errorMessage:data.error})
            }
        }
    }
    render(){
        if(this.state.diKlik){
            return (
                <Redirect to="/tujuanList"></Redirect>
            )
        }
        if(getToken()){
            return(
                    <Grid container>
                        <Grid item sm={12} xs={12} style={{maxHeight:50}}>
                            <TitleBar
                                title={this.state.modifyType ? 'Tujuan Pinjaman - Ubah':'Tujuan Pinjaman - Detail'}

                            />
                        </Grid>

                        <Grid
                            item
                            sm={12} xs={12}
                            style={{padding:'20px', marginBottom:20, boxShadow:'0px -3px 25px rgba(99,167,181,0.24)', WebkitBoxShadow:'0px -3px 25px rgba(99,167,181,0.24)', borderRadius:'15px'}}                  
                        >
                        
                          <Grid container>
                               <Grid container style={{display:'flex', justifyContent:'flex-end', padding:'0'}}>
                                       {
                                            checkPermission('core_loan_purpose_patch') && this.state.modifyType &&
                                            <Tooltip title="Save" style={{outline:'none'}}>
                                            <IconButton aria-label="save" onClick={()=>this.btnConfirmationDialog('','','Are you sure want to save this data ?')} >
                                                <SaveIcon style={{width:'35px',height:'35px'}}/>
                                            </IconButton>
                                            </Tooltip>
                                        }

                                        {
                                            checkPermission('core_loan_purpose_patch') && !this.state.modifyType &&
                                            <Tooltip title="Edit" style={{outline:'none'}}>
                                            <IconButton aria-label="edit" onClick={this.btnEditPermission}>
                                                <EditIcon style={{width:'35px',height:'35px'}}/>
                                            </IconButton>
                                            </Tooltip>
                                        }
                                        <Tooltip title="Back" style={{outline:'none'}}>
                                                <IconButton aria-label="cancel" onClick={this.btnCancel}>
                                                    <CancelIcon style={{width:'35px',height:'35px'}} />
                                                </IconButton>
                                        </Tooltip>
                                </Grid>

                            {/* Error */}
                                    <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', color:'red'}}>
                                        {this.state.errorMessage}
                                    </Grid>

                                    <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                         <Grid container>
                                                <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                                    ID Tujuan Pembiayaan
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
                                         Tujuan Pembiayaan
                                    </Grid>
                                    <Grid item xs={4} sm={4} >
                                        <TextField
                                            id="name"
                                            value={this.state.name}
                                            onChange={(e) => this.onChangeTextField(e,'name')} 
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
        }
        if(!getToken()){
            return (
                <Redirect to='/login' />
            )    
        }
       
    }
}

export default TujuanDetail;