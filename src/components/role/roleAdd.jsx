import React from 'react'
import { Redirect } from 'react-router-dom'
import swal from 'sweetalert'
import { AddRoleFunction } from './saga';
import { getToken } from '../index/token';

import { checkPermission } from '../global/globalFunction';
import { Grid, TextField,FormControlLabel,Checkbox } from '@material-ui/core';
import DialogComponent from '../subComponent/DialogComponent';
import TitleBar from '../subComponent/TitleBar';
import ActionComponent from '../subComponent/ActionComponent';
import DropDown from '../subComponent/DropDown';

class RoleAdd extends React.Component{
    _isMounted = false;
    state = {
        diKlik:false,
        errorMessage:'',
        check:false,
        submit:false,
        status:false,
        description:'',
        name:'',
        listSystem:[
            {
            id:"Mobile",
            name:"Mobile"
            },
            {id:"Core",name:"Core"},{id:"Dashboard",name:"Dashboard"}
        ],
        system:'Mobile'
       };
    componentDidMount(){
        this._isMounted = true;
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    btnCancel = ()=>{
        this.setState({diKlik:true})
    }
    UNSAFE_componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }
    btnSave=()=>{
        var name = this.state.name
        var system = this.state.system
        var description = this.state.description
        var status = this.state.status ? "active" :"inactive"
        var permissions =[]

        if(name.trim()==="" || name ===""){
            this.setState({errorMessage:"Nama Role Kosong - Harap Cek Ulang"})
        }else{
            this.setState({submit:true})
            var newData = {name,system,description,status,permissions}
            this.addRole(newData)
        }
    }
    
    addRole = async function (params) {
        const data  = await AddRoleFunction(params)
        if(data){
            if(!data.error){
                swal("Success","Role berhasil di tambah","success")
                this.setState({diKlik:true,submit:false})
            }else{
                this.setState({errorMessage:data.error,submit:false})
            }
        }
    }
   
    renderBtnSumbit =()=>{
        if( this.state.submit) {
         return <input type="button" disabled className="btn btn-success" value="Simpan" onClick={this.btnSave} style={{cursor:"wait"}}/>
        }else{
        return <input type="button" className="btn btn-success" value="Simpan" onClick={this.btnSave}/>
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

    onChangeDropDown = (e) => {
        const labelName = e.target.name.toString().toLowerCase();
        let system = e.target.value;
  
      if(labelName === 'system') {
        if(e.target.value === 'Core') {
          for(const key in this.state.listPenyediaAgent) {
            system = this.state.listPenyediaAgent[key].id;
            break;
          }
        } else if(e.target.value === 'Mobile') {
          for(const key in this.state.listBank) {
            system = this.state.listBank[key].id;
            break;
          }
        }
        else if(e.target.value === 'Dashboard') {
            for(const key in this.state.listBank) {
              system = this.state.listBank[key].id;
              break;
            }
          }
        this.setState({system})
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
    


    render(){
        if(this.state.diKlik){
            return <Redirect to='/roleList'/>            
        }
        if(getToken()){
            return(

                <Grid container>
                        <Grid item sm={12} xs={12} style={{maxHeight:50}}>
                            <TitleBar
                                title={'Role - Tambah'}
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
                                            permissionAdd={ checkPermission('core_role_new') ?  ()=>this.btnConfirmationDialog('','','Are you sure want to save this data ?')  : null}
                                            onCancel={this.btnCancel}
                                        />
                            </Grid>

                            </Grid>

                            {/* Error */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', color:'red'}}>
                                    {this.state.errorMessage}
                            </Grid>

                     
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                         <Grid container>
                                                <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                                   Nama Role
                                                </Grid>
                                                <Grid item xs={12} sm={4} >
                                                    <TextField
                                                        id="id"
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
                                                    Sistem
                                                </Grid>
                                                <Grid item xs={12} sm={4} >
                                                <DropDown
                                                    value={this.state.system}
                                                    label="System"
                                                    data={this.state.listSystem}
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

export default RoleAdd;