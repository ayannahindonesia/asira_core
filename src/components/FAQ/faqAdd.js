import React from 'react'
import { Redirect } from 'react-router-dom'
import swal from 'sweetalert'
import { addFAQFunction } from './saga';
import { getToken } from '../index/token';
import { Tooltip, Grid, IconButton } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';
import TitleBar from '../subComponent/TitleBar';
import DialogComponent from '../subComponent/DialogComponent';

class FAQAdd extends React.Component{
    _isMounted = false;
    state={diKlik:false,errorMessage:'',submit:false}
    
    UNSAFE_componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }
    componentDidMount(){
        this._isMounted = true;
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    btnSave=()=>{
        var title= this.refs.judul.value
        var description = this.refs.deskripsi.value
  
        if (title ===""||title.trim()==="" || description===''|| description.trim()===''){
            this.setState({errorMessage:"Ada field yang kosong - Harap cek ulang"})
        }
        else{
            this.setState({submit:true})
            var newData={title,description}
            this.addFAQ(newData)
        }
    }

    addFAQ = async function (params) {
        const data = await addFAQFunction(params)
        if(data){
            if(!data.error){
                this.setState({submit:false,diKlik:true,errorMessage:""})
                swal("Success","FAQ baru berhasil di tambah","success")
            }else{
                this.setState({errorMessage:data.error,submit:false})
            }
        }
    }

    btnConfirmationDialog = (e, nextStep) => {
        this.setState({dialog: !this.state.dialog})
  
        if(nextStep) {
            this.btnSave()
        }
      }
    renderBtnSumbit =()=>{
        if( this.state.submit) {
         return <input type="button" disabled className="btn btn-success ml-3 mr-3" value="Simpan" onClick={this.btnSave} style={{cursor:"wait"}}/>
        }else{
        return <input type="button" className="btn btn-success ml-3 mr-3" value="Simpan" onClick={this.btnSave}/>
        }
    }
    btnCancel =()=>{
        this.setState({diKlik:true})
    }

    render(){
        if(this.state.diKlik){
            return <Redirect to="/FAQ"/>
        }
        if(getToken()){
            return(
                <Grid container>
                <Grid item sm={12} xs={12} style={{maxHeight:50}}>
                    <TitleBar
                    title={ 'FAQ - Ubah'}
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

                        <Tooltip title="Save" style={{outline:'none'}}>
                            <IconButton aria-label="save" onClick={this.btnConfirmationDialog} >
                            <SaveIcon style={{width:'35px',height:'35px'}}/>
                            </IconButton>
                        </Tooltip>
                        

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
                Judul FAQ
              </Grid>

              <Grid item sm={8} xs={8} style={{padding:'10px'}}>
              <input type="text" className="form-control" ref="judul" 
                placeholder="Judul FAQ.."
               required autoFocus style={{width:"80%"}}/>

              </Grid>

              <Grid item sm={4} xs={4} style={{padding:'10px'}}>
                Deskripsi
              </Grid>

              <Grid item sm={8} xs={8} style={{padding:'10px'}}>
              <textarea  style={{width:"80%"}} rows="10" ref="deskripsi" className="form-control" placeholder="Description.." required autoFocus/>
              </Grid>

            </Grid>

          </Grid>
          <DialogComponent 
            title={'Confirmation'}
            message={'Are you sure want to save this data ?'}
            type={'textfield'}
            openDialog={this.state.dialog}
            onClose={this.btnConfirmationDialog}
          />

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

export default FAQAdd;