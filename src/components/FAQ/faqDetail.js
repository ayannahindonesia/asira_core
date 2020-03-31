import React from 'react'
import { Redirect } from 'react-router-dom'
import { EditFAQFunction,detailFAQFunction,DeleteFAQFunction } from './saga';
import { getToken } from '../index/token';
import TitleBar from '../subComponent/TitleBar';
import { Grid,TextField } from '@material-ui/core';

import { checkPermission } from '../global/globalFunction';
import swal from 'sweetalert'
import DialogComponent from '../subComponent/DialogComponent';
import ActionComponent from '../subComponent/ActionComponent';

class FAQDetail extends React.Component{
    _isMounted = false;
    state={
        diKlik:false,
        errorMessage:'',
        submit:false,
        modifyType:false,
        title:'',
        description:'',
        messageDialog:''
    }
    
    UNSAFE_componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }
    componentDidMount(){
        this._isMounted = true;
        this.detailFAQ()

    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    detailFAQ = async function () {
        const param={}
        param.id = this.props.match.params.id
        const data = await detailFAQFunction(param)
        if(data){
           
            if(!data.error){
               this.setState({
                     title:data.FAQDetail.title,
                     description:data.FAQDetail.description
                    })
            }else{
                this.setState({errorMessage:data.error,submit:false})
            }
        }
    }
    
    // ---------------------------------------------------------------------------- EDIT----------------------------------------------------------------------------------------------------
    btnEdit=()=>{
        var title= this.state.title
        var description = this.state.description
  
        if (title ===""||title.trim()==="" || description===''|| description.trim()===''){
            this.setState({errorMessage:"Ada field yang kosong - Harap cek ulang"})
        }else{
            this.setState({submit:true})
            const param = {}
            param.id=this.props.match.params.id
            param.newData={title,description}
            this.editFAQ(param)
        }
    }
    
    editFAQ = async function (params) {
        const data = await EditFAQFunction(params)
        if(data){
            if(!data.error){
                this.setState({submit:false,diKlik:true,errorMessage:""})
                swal("Success","FAQ baru berhasil di perbarui","success")
            }else{
                this.setState({errorMessage:data.error,submit:false})
            }
        }
    }

    // ---------------------------------------------------------------------------- DELETE----------------------------------------------------------------------------------------------------
    
    btnDelete = ()=>{
        const param = {}
        param.id = this.props.match.params.id
        this.deleteFAQ(param)
    }

    deleteFAQ = async function (params){
        const data = await DeleteFAQFunction(params)
        if(data){
            if(!data.error){
                this.setState({submit:false,diKlik:true,errorMessage:""})
                swal("Success","FAQ baru berhasil di hapus","success")
            }else{
                this.setState({errorMessage:data.error,submit:false})
            }
        }
    }
    // ---------------------------------------------------------------------------- HANDLE EVENT ----------------------------------------------------------------------------------------------------

    btnConfirmationDialog = (e, nextStep, pesan) => {
        this.setState({dialog: !this.state.dialog,messageDialog:pesan})

        if(nextStep && this.state.messageDialog.includes('save')) {
            this.btnEdit() 
        }else if(nextStep && this.state.messageDialog.includes('delete')){
            this.btnDelete()
        }
    }

    onChangeTextField = (e, labelData,number) => {
        let dataText = e.target.value;

        console.log(dataText)
        if(number && isNaN(dataText)) {           
            dataText = this.state[labelData];          
        }
        this.setState({[labelData]:dataText})
    }

    btnEditPermission =()=>{
        this.setState({modifyType:true})
    }

    render(){
        if(this.state.diKlik){
            return(
                <Redirect to="/FAQ"/>
            )
        }
        else if(getToken()){
            return(
       
                    <Grid container>
                        <Grid item sm={12} xs={12} style={{maxHeight:50}}>
                            <TitleBar
                             title={this.state.modifyType ? 'FAQ - Ubah':'FAQ - Detail'}
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
                                    permissionEdit={ checkPermission('core_faq_patch') ? (this.state.modifyType ? ()=>this.btnConfirmationDialog('','','Are you sure want to save this data ?') : this.btnEditPermission) : null}
                                    permissionDelete={ checkPermission('core_faq_delete') ?  ()=>this.btnConfirmationDialog('','','Are you sure want to delete this data ?') : null}
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
                                                    Judul FAQ
                                                </Grid>
                                                <Grid item xs={12} sm={4} >
                                                    <TextField
                                                        id="title"
                                                        value={this.state.title}
                                                        onChange={(e) => this.onChangeTextField(e,'title')} 
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

export default FAQDetail;