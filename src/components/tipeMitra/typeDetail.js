import React from 'react'
import { Redirect } from 'react-router-dom'
import swal from 'sweetalert'
import { EditTipeBankFunction, DetailTipeBankFunction } from './saga';
import { getToken } from '../index/token';
import DialogComponent from '../subComponent/DialogComponent';
import { Grid, TextField } from '@material-ui/core';

import { checkPermission } from '../global/globalFunction';
import TitleBar from '../subComponent/TitleBar';
import Loading from '../subComponent/Loading';
import ActionComponent from '../subComponent/ActionComponent';

class TipeMitraDetail extends React.Component{
    _isMounted = false;
    state={
        id: 0,
        diKlik:false,
        errorMessage:'',
        namaTipeMitra: '',
        description: '',
        dialog: false,
        modifyType: false,
        loading: true,
    }
    
    UNSAFE_componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }

    componentDidMount(){
        this._isMounted = true;
        this.getTipeMitraDetail()
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getTipeMitraDetail = async function () {
        const id = this.props.match.params.id
        const data = await DetailTipeBankFunction({id});

        if(data){
            if(!data.error){
                const dataTipe = data || {};
                this.setState({
                    id: dataTipe.id,
                    namaTipeMitra: dataTipe.name,
                    description: dataTipe.description,
                    errorMessage:"",
                    loading:false,
                })
            }else{
                this.setState({errorMessage:data.error, loading:false})
            }
        }
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
        const name= this.state.namaTipeMitra
        const description = this.state.description
        
        if (name ===""||name.trim()===""){
            this.setState({errorMessage:"Nama Tipe Mitra Kosong - Harap cek ulang"})
        }else{
            const newData={
                id:this.state.id,
                newData:{
                    name,
                    description: description.toString().trim().length !== 0 ? description : '-'
                }
            }
            
            this.editTipeMitraDetail(newData)
        }
    }

    editTipeMitraDetail = async function (params) {
        const data = await EditTipeBankFunction(params)
        if(data){
            if(!data.error){
                this.setState({diKlik:true,errorMessage:""})
                swal("Success","Tipe Mitra Berhasil diubah","success")
            }else{
                this.setState({errorMessage:data.error, loading:false})
            }
        }
    }
    
    btnCancel =()=>{
        this.setState({diKlik:true})
    }

    btnEditTipeMitra = () => {
        this.setState({modifyType: true})
    }

    render(){
        if(this.state.diKlik){
            return <Redirect to="/tipeList"/>
        } else if(this.state.loading) {
            return(
                <Loading
                    title={this.state.modifyType ? 'Tipe Mitra - Ubah' : 'Tipe Mitra - Detail'}
                />
            )
            
             
        } else if(getToken()){
            return(
                <Grid container>

                    <Grid item sm={12} xs={12} style={{maxHeight:50}}>
                        
                        <TitleBar
                            title={this.state.modifyType ? 'Tipe Mitra - Ubah' : 'Tipe Mitra - Detail'}
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

                                <ActionComponent
                                    modifyType={this.state.modifyType}
                                    permissionEdit={ checkPermission('core_bank_type_patch') ? (this.state.modifyType ? this.btnConfirmationDialog : this.btnEditTipeMitra) : null}
                                    onCancel={this.btnCancel}
                                />

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
                                            disabled={!this.state.modifyType}
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
                                            disabled={!this.state.modifyType}
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

export default TipeMitraDetail;