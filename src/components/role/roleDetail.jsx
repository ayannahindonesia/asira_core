import React from 'react'
import { Redirect } from 'react-router-dom'
import { DetailRoleFunction, EditRoleFunction } from './saga';
import { getToken } from '../index/token';
import { Grid, Tooltip, IconButton, TextField,FormControlLabel,Checkbox } from '@material-ui/core';
import { checkPermission } from '../global/globalFunction';

import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';

import DialogComponent from '../subComponent/DialogComponent';
import TitleBar from '../subComponent/TitleBar';
import swal from 'sweetalert'

class RoleDetail extends React.Component{
    _isMounted = false;
    state= {diKlik:false,rows:[],errorMessage:'',
            description:'',status:false
            }
 
    componentDidMount(){
        this._isMounted=true;
        this.detailRole()
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    detailRole = async function (params) {
        const id = this.props.match.params.id
        const param ={
            id,
        }
        const data = await DetailRoleFunction(param);
        if(data){
            if(!data.error){
                this.setState({rows:data.data,description:data.data.description,status:data.data.status ==="active"?true:false})
            }else{
                this.setState({errorMessage:data.error})
            }
        }
    }
    btnBack = ()=>{
        this.setState({diKlik:true})
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

    btnEditPermission = () => {
        this.setState({modifyType: true})
    }

    btnConfirmationDialog = (e, nextStep, pesan) => {
        this.setState({dialog: !this.state.dialog,messageDialog:pesan})

        if(nextStep && this.state.messageDialog.includes('save')) {
            this.btnEdit() 
        }else if(nextStep && this.state.messageDialog.includes('delete')){
            this.btnDelete()
        }
    }

    btnEdit = ()=>{
        var id = this.props.match.params.id
        var description = this.state.description || "-"
        var status =  this.state.status ? "active":"inactive"
        var newData = {description,status}
        const param = {
            id,newData
        }
        this.setState({submit:true})
        this.editRole(param)
    }

    editRole = async function (params) {
        const data = await EditRoleFunction(params)
        if(data){
            if(data.error){
                this.setState({errorMessage:data.error,submit:false})
            }else{
                swal("Success","Role berhasil di Edit","success")
                this.setState({diKlik:true,submit:false})
            }
        }
    }
    render(){
        if(this.state.diKlik){
            return <Redirect to="/roleList"></Redirect>
        }
        if(getToken()){
            return(
                    <Grid container>
                        <Grid item sm={12} xs={12} style={{maxHeight:50}}>
                            <TitleBar
                                title={this.state.modifyType ? 'Role - Ubah':'Role - Detail'}
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
                                        checkPermission('core_role_patch') && this.state.modifyType &&
                                        <Tooltip title="Save" style={{outline:'none'}}>
                                        <IconButton aria-label="save" onClick={()=>this.btnConfirmationDialog('','','Are you sure want to save this data ?')} >
                                            <SaveIcon style={{width:'35px',height:'35px'}}/>
                                        </IconButton>
                                        </Tooltip>
                                    }

                                    {
                                        checkPermission('core_role_patch') && !this.state.modifyType &&
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



                            </Grid>

                            {/* Error */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', color:'red'}}>
                                    {this.state.errorMessage}
                            </Grid>

                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                         <Grid container>
                                                <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                                   Role ID
                                                </Grid>
                                                <Grid item xs={12} sm={4} >
                                                    <TextField
                                                        id="id"
                                                        value={this.state.rows.id}
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
                                                   Nama Role
                                                </Grid>
                                                <Grid item xs={12} sm={4} >
                                                    <TextField
                                                        id="id"
                                                        value={this.state.rows.name}
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
                                                    Sistem
                                                </Grid>
                                                <Grid item xs={12} sm={4} >
                                                    <TextField
                                                        id="id"
                                                        value={this.state.rows.system}
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
                                        Deskripsi
                                    </Grid>
                                    <Grid item xs={12} sm={4} >
                                        <TextField
                                            id="description"
                                            value={this.state.description}
                                            onChange={(e) => this.onChangeTextField(e,'description')} 
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

export default RoleDetail;